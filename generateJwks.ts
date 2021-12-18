#!/usr/bin/env node

import { generateKeys, parseHex, SIGNING_ALGS } from '@i3m/non-repudiation-library'

const args = process.argv.slice(2)

let alg: typeof SIGNING_ALGS[number] = 'ES256'
let privateKeyHex: string | undefined

if (!nullish(args[0])) {
  if (SIGNING_ALGS.includes(args[0] as any)) {
    alg = args[0] as typeof SIGNING_ALGS[number]
  } else {
    error()
  }
}
if (!nullish(args[1])) {
  privateKeyHex = parseHex(args[1])
}

function nullish (a: string | undefined): boolean {
  return (a === undefined || a === '')
}

generateKeys(alg, privateKeyHex).then((jwkPair) => {
  console.log(jwkPair)
}).catch(() => {
  error()
})

function error (): void {
  console.log(`Usage: generateJwks <alg> [<privateKeyHex>]
    <alg>            - is one of ${SIGNING_ALGS.toString()}
    <privateKeyHex>  - an optional private key in hexadecimal`)
  process.exit()
}
