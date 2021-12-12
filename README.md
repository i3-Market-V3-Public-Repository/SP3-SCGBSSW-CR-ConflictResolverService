[![License: EUPL-1.2](https://img.shields.io/badge/license-EUPL--1.2-green.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Conflict Resolver Service

It is a core element of the Conflict Resolution system in i3-MARKET. [Read more here](./conflict-resolution.md).

## Endpoints

The Conflict-Resolver Service provides two endpoints: one for checking that the protocol was executed properly, and other one to initiate a dispute when a Consumer B claims that he cannot decrypt the cipherblock he has been invoiced for.

### ```POST /verification```

The Conflict-Resolver Service (CSR) can be queried to provide a signed resolution about a data exchanged successfully performed or not. It could be invoked by either the consumer or the provider. The provider should query this endpoint and send it along with the invoice to the consumer.

This endpoint can be accessed at `POST /verification` and is requires valid i3-MARKET Consumer or Provider's credentials.

#### Input

A verification request as a compact JSON Web Signature (JWS) along with the public key to verify it. For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.

```typescript
{
  verificationRequest: string // the verification request in compact JWS format
  publicJwk: string // the public key of the signer of the verification request in JWK. It should match one of the public JWKs in the data exchange, either 'orig' or 'dest'
}
```

A verification request is a JWS signed by either the consumer or the provider using the same key he/she used for the data exchange. It holds either a valid PoR or a valid PoP associated to the data exchange to be verified. Either proof is enough to verify the data exchange and check if the secret was published to the ledger.

```typescript
{
  iss: 'orig' | 'dest'
  iat: number // unix timestamp for issued at
  proof: string // a compact JWS holding a PoR (if iss === 'dest') or a PoP (if iss === 'orig'). The proof MUST be signed with the same key used to sign this verificationRequest
}
```

#### Output

It returns a signed resolution as a compact JWS with payload:

```typescript
{
  type: 'verification'
  dataExchangeId: string // the unique id of this data exchange
  resolution: 'completed' | 'not completed' // whether the data exchange has been verified to be complete
  iat: nume // unix timestamp stating when it was verified
  iss: string // the public key of the CRS in JWK
}
```

### ```POST /dispute```

Notice that the signed resolution obtained from `POST /verification` does not ensure that the published secret could be used to decrypt the encrypted block of data. If the consumer B is not able to decrypt the cipherblock, he could initiate a dispute on the CRS. The CRS will also provide signed resolution of whether B is right or not.

All this is handled in this endpoint, which can only be queried if in possession of valid i3-MARKET Consumer's credentials.

#### Input

A dispute request as a compact JSON Web Signature (JWS) along with the public key to verify it. For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.

```typescript
{
  disputeRequest: string // the dispute request in compact JWS format
  publicJwk: string // the public key of the signer of the dispute request as a JWK. It should match the public JWK 'dest' in the data exchange
}
```

A dispute request is a JWS signed by the consumer using the same key he/she used for the data exchange. It holds a valid PoR, and the received cipherblock.

```typescript
{
  por: string // a the PoR in compact JWS format
  cipherblock: string // the cipherblock as a JWE string
}
```

#### Output

It returns a signed resolution as a compact JWS with payload:

```typescript
{
  type: 'dispute'
  dataExchangeId: string // the unique id of this data exchange
  resolution: 'accepted' | 'denied' // resolution is 'denied' if the cipherblock can be properly decrypted; otherwise is 'accepted'
  iat: nume // unix timestamp stating when it was verified
  iss: string // the public key of the CRS in JWK
}
```

## Set up the service

If you haven't registered yet an OIDC client, point your browser to [https://identity1.i3-market.eu/developers/login](https://identity1.i3-market.eu/developers/login) and use the following credentials to get a valid initial access token for client registration:

- username: `test@i3-market.eu`
- password: `i3market`
  
Once you have a token, use Postman or any other application to generate POST to [https://identity1.i3-market.eu/oidc/reg](https://identity1.i3-market.eu/oidc/reg). The POST MUST use the token as an authorization bearer token, and the contents can be, e.g.:

```json
{
   "application_type": "web",
   "redirect_uris": ["https://mydomain.com/oidc/cb"],
   "client_name": "Express OIDC RP Example",
   "grant_types": [ "authorization_code" ],
   "response_types": [ "code" ],
   "token_endpoint_auth_method": "client_secret_jwt",
   "id_token_signed_response_alg": "EdDSA"
}
```

The response will be something like:

```json
{
    "application_type": "web",
    "grant_types": [
        "authorization_code"
    ],
    "id_token_signed_response_alg": "EdDSA",
    "post_logout_redirect_uris": [],
    "require_auth_time": false,
    "response_types": [
        "code"
    ],
    "subject_type": "public",
    "token_endpoint_auth_method": "client_secret_jwt",
    "introspection_endpoint_auth_method": "client_secret_jwt",
    "revocation_endpoint_auth_method": "client_secret_jwt",
    "require_signed_request_object": false,
    "request_uris": [],
    "client_id_issued_at": 1613595853,
    "client_id": "zUtIHIr2H0rZESiIYt9uj",
    "client_name": "Express OIDC RP Example",
    "client_secret_expires_at": 0,
    "client_secret": "fJkWq2LeiD7nsgnD676LKRtFeReJo5rqriE5pcOrySHkv2t67eXviH4KU11ETrZJ_q45yQW137WEaPGJZ1jhtA",
    "redirect_uris": [
        "https://identity1.i3-market.eu/oidc/cb"
    ],
    "registration_client_uri": "https://identity1.i3-market.eu/oidc/reg/zUtIHIr2H0rZESiIYt9uj",
    "registration_access_token": "FkhdFE37IIBv-AoQbotXZPRu6T2luw0upxPiDfTncXK"
}
```

Copy `env.template` to `.env` and fill the OIDC client metadata from those received, basically set `CLIENT_ID` to received `client_id`, `CLIENT_SECRET` to `client_secret`, and `TOKEN_SIGNING_ALG` to `id_token_signed_response_alg`. 

Besides the OIDC you may need to define the public uri of your server, since it is likely that you run this service behind a TLS reverse proxy. Just set `PUBLIC_URI` to your server address.

> If you find it more convenient, you can pass the previous variables as environment variables to node instead of using the `.env` file.

Point your browser to `/oidc/login/consumer` to init a consumer login process, or to `/oidc/login/provider` to init the provider one. You will need to download the i3Market wallet. Once the process is completed, you will get a valid access token that you can use as a bearer token to access the protected endpoints `/verification` and `/dispute`.
