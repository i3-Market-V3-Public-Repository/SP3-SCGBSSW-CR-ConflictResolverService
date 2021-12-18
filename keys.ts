import { generateKeys, JwkPair, parseJwk, verifyKeyPair } from '@i3m/non-repudiation-library'

async function jwkPairAsync (): Promise<JwkPair> {
  if (!nullish(process.env.PRIVATE_JWK) && !nullish(process.env.PUBLIC_JWK)) {
    const publicJwk = await parseJwk(JSON.parse(process.env.PUBLIC_JWK as string), false)
    const privateJwk = await parseJwk(JSON.parse(process.env.PUBLIC_JWK as string), false)
    await verifyKeyPair(publicJwk, privateJwk)
    return {
      publicJwk,
      privateJwk
    }
  } else {
    return await generateKeys('ES256')
  }
}

export default jwkPairAsync()

function nullish (a: string | undefined): boolean {
  return (a === undefined || a === '')
}
