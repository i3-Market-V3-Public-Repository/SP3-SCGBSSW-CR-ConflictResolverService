import * as pkgJson from '../package.json'
import * as _ from 'lodash'
import config from '../config'

export interface Replacement {
  searchValue: string
  replacement: string
}

export function makeReplacements (text: string, customReplacements: Replacement[] = config.customReplacements): string {
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

export function makeObjectReplacements (obj: {[key: string | symbol]: any}, customReplacements: Replacement[] = config.customReplacements): void {
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object') {
      makeObjectReplacements(value as {})
    } else if (typeof value === 'string') {
      obj[key] = makeReplacements(value, customReplacements)
    }
  }
}
