import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import SwaggerParser from '@apidevtools/swagger-parser'
import { OpenAPIV3 } from 'openapi-types'
import jsYaml from 'js-yaml'

import { replaceFromPkgJson } from './replaceFromPkgJson'

const rootDir = path.join(__dirname, '..')

function fixRefs (obj: {}): void {
  for (const value of Object.values(obj)) {
    if (typeof value === 'object') {
      if ((value as any).$ref !== undefined) {
        if (Object.keys(value as any).length > 1) {
          delete (value as any).$ref
        } else {
          (value as any).$ref = (value as any).$ref.replace(/.+\.(json|yaml)#/, '#')
        }
      }
      fixRefs(value as {})
    }
  }
}

function removeIgnoredPaths (spec: OpenAPIV3.Document): void {
  delete spec.paths['/_IGNORE_PATH']
}

const bundleSpec = async function (): Promise<OpenAPIV3.Document> {
  const openApiPath = path.join(rootDir, 'spec', 'openapi.yaml')

  const parser = new SwaggerParser()
  const rootApi = await parser.parse(openApiPath)
  const refs = (await parser.resolve(openApiPath)).values()

  const specs = []
  for (const [ref, spec] of Object.entries(refs)) {
    if (ref !== openApiPath) {
      specs.push(spec)
    }
  }
  const bundledSpec: OpenAPIV3.Document = _.defaultsDeep(rootApi, ...specs)
  fixRefs(bundledSpec)
  removeIgnoredPaths(bundledSpec)
  return bundledSpec
}

const bundle = async (): Promise<void> => {
  const api = await bundleSpec()
  const pkgJson = await import(path.join(rootDir, 'package.json'))

  fs.mkdirSync(pkgJson.directories.spec, { recursive: true })

  const jsonBundle = path.join(rootDir, pkgJson.exports['./openapi.json'])
  fs.writeFileSync(jsonBundle, replaceFromPkgJson(JSON.stringify(api, undefined, 2)))
  console.info(`\x1b[32mOpenAPI Spec JSON bundle written to -> ${jsonBundle}\x1b[0m`)

  const yamlBundle = path.join(rootDir, pkgJson.exports['./openapi.yaml'])
  fs.writeFileSync(yamlBundle, replaceFromPkgJson(jsYaml.dump(api)))
  console.info(`\x1b[32mOpenAPI Spec YAML bundle written to -> ${yamlBundle}\x1b[0m`)
}

export default bundle

if (require.main === module) {
  bundle().catch((err) => {
    console.trace(err)
  })
}