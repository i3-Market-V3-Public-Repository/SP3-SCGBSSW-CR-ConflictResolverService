import * as pkgJson from '../package.json'
import * as _ from 'lodash'

export function replaceFromPkgJson (text: string): string {
  const matches = text.matchAll(/{{(.+?)}}/g)
  if (matches === null) return text

  let replaced = text
  for (const match of matches) {
    const regExp = new RegExp(match[0], 'g')
    const replacement = _.get(pkgJson, match[1]) ?? ''
    replaced = replaced.replace(regExp, replacement)
  }
  return replaced
}
