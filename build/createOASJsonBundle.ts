import fs from 'fs'
import jsYaml from 'js-yaml'
import { OpenAPIV3 } from 'openapi-types'
import path from 'path'
import pkgJson from '../package.json'

const rootDir = path.join(__dirname, '..')

function fillWithPkgJsonData (spec: OpenAPIV3.Document): void {
  spec.info.description = pkgJson.description
  spec.info.license = { name: pkgJson.license }
  spec.info.contact = {
    name: pkgJson.author.name,
    email: pkgJson.author.email,
    url: pkgJson.author.url
  }
}

const bundle = async (): Promise<void> => {
  const openApiPath = path.join(rootDir, 'spec-src', 'openapi.yaml')

  let oasYaml = fs.readFileSync(openApiPath, 'utf-8')
  const oas = jsYaml.load(oasYaml) as OpenAPIV3.Document

  fillWithPkgJsonData(oas)

  oasYaml = oasYaml.replace(/(^info:)([\s\S]*?)(^[a-z]+:)/gm, (match, p1: string, p2: string, p3: string) => {
    return p1 + '\n' + jsYaml.dump(oas.info).replace(/^[\w\s]/gm, '  $&') + p3
  })

  const oasJsonPath = path.join(rootDir, 'spec', 'openapi.json')
  fs.mkdirSync(path.dirname(oasJsonPath), { recursive: true })

  fs.writeFileSync(oasJsonPath, JSON.stringify(oas, undefined, 2))
  console.info(`\x1b[32mOpenAPI Spec JSON written to -> ${oasJsonPath}\x1b[0m`)

  const yamlBundle = path.join(rootDir, 'spec', 'openapi.yaml')
  const yamlBundleDist = path.join(rootDir, 'dist', 'spec', 'openapi.yaml') // tsc does not automatically copy .yaml to dist/spec
  fs.mkdirSync(path.dirname(yamlBundleDist), { recursive: true })
  fs.writeFileSync(yamlBundle, oasYaml)
  fs.writeFileSync(yamlBundleDist, oasYaml)
  console.info(`\x1b[32mOpenAPI Spec YAML bundle written to -> ${yamlBundle}\x1b[0m`)
}

export default bundle

if (require.main === module) {
  bundle().catch((err) => {
    console.trace(err)
  })
}
