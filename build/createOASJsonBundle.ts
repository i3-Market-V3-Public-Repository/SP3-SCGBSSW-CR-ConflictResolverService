import fs, { readFileSync } from 'fs'
import path from 'path'

import _ from 'lodash'
import SwaggerParser from '@apidevtools/swagger-parser'
import { OpenAPIV3 } from 'openapi-types'
import jsYaml from 'js-yaml'

import { makeReplacements } from './replacements'

const rootDir = path.join(__dirname, '..')

function fixRefs (obj: {}): void {
  for (const value of Object.values(obj)) {
    if (value !== null && typeof value === 'object') {
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
  const openApiPath = path.join(rootDir, 'spec-src', 'openapi.yaml')

  const parser = new SwaggerParser()
  const options: SwaggerParser.Options = {
    resolve: {
      file: {
        read: (file): string => {
          return makeReplacements(readFileSync(file.url, 'utf-8'))
        }
      }
    }
  }
  const rootApi = await parser.parse(openApiPath, options)
  const refs = (await parser.resolve(openApiPath, options)).values()

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

  const jsonBundle = path.join(rootDir, 'spec', 'openapi.json')
  fs.mkdirSync(path.dirname(jsonBundle), { recursive: true })

  fs.writeFileSync(jsonBundle, JSON.stringify(api, undefined, 2))
  console.info(`\x1b[32mOpenAPI Spec JSON bundle written to -> ${jsonBundle}\x1b[0m`)

  const yamlBundle = path.join(rootDir, 'dist', 'spec', 'openapi.yaml')
  fs.mkdirSync(path.dirname(yamlBundle), { recursive: true })
  fs.writeFileSync(yamlBundle, jsYaml.dump(api))
  console.info(`\x1b[32mOpenAPI Spec YAML bundle written to -> ${yamlBundle}\x1b[0m`)
}

export default bundle

if (require.main === module) {
  bundle().catch((err) => {
    console.trace(err)
  })
}
