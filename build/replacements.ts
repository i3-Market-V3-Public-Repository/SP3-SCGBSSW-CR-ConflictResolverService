import { config as loadEnvFile } from 'dotenv'
import { existsSync } from 'fs'
import * as _ from 'lodash'
import { oidc } from '../config/oidc'
import * as pkgJson from '../package.json'

if (existsSync('./.env')) loadEnvFile()
export const defaultReplacements: Replacement[] = [
  {
    searchValue: 'openIdWellKnownUri',
    replacement: oidc.providerUri + '/.well-known/openid-configuration'
  }
]

export interface Replacement {
  searchValue: string
  replacement: string
}

export function makeReplacements (text: string, customReplacements: Replacement[] = defaultReplacements): string {
  const matches = text.matchAll(/{{(.+?)}}/g)
  if (matches === null) return text

  let replaced = text
  for (const match of matches) {
    let replacement: Replacement | undefined
    if (customReplacements !== undefined) {
      replacement = customReplacements.find(replacement => replacement.searchValue === match[1])
      if (replacement !== undefined) {
        replacement.searchValue = `{{${replacement.searchValue}}}`
      }
    }
    if (match[1].substring(0, 8) === 'pkgJson.') {
      replacement = {
        searchValue: match[0],
        replacement: _.get(pkgJson, match[1].substring(8)) ?? ''
      }
    }
    if (replacement !== undefined) {
      replaced = replaced.replace(new RegExp(replacement.searchValue, 'g'), replacement.replacement)
    }
  }
  return replaced
}

export function makeObjectReplacements (obj: {[key: string | symbol]: any}, customReplacements: Replacement[] = defaultReplacements): void {
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object') {
      makeObjectReplacements(value as {})
    } else if (typeof value === 'string') {
      obj[key] = makeReplacements(value, customReplacements)
    }
  }
}
