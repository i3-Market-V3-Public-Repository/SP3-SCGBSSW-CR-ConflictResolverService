# Conflict Resolver Service

It is a core element of the Conflict Resolution system in i3-MARKET. [Read more here](./conflict-resolution.md).

## Endpoints

The Conflict-Resolver Service provides two endpoints: one for checking that the protocol was executed properly, and other one to initiate a dispute when a Consumer B claims that he cannot decrypt the cipherblock he has been invoiced for.

### ```POST /verification```

Authenticated endpoint that can only be accessed by i3-MARKET Consumers.

#### Input

A valid PoR or PoP as a compact JSON Web Signature (JWS) should be POSTed to this endpoint. Either proof is enough to verify the data exchange and check if the secret was published to the ledger.

```typescript
{
  por?: string // a the PoR in compact JWS format
  pop?: string // a the PoP in compact JWS format
}
```

#### Output

It returns a signed resolution as a compact JWS with payload:

```typescript
{
  dataExchangeId: string // the unique id of this data exchange
  exchangeVerified: boolean // whether the completion of the data exchange has been verified
  iat: nume // unix timestamp stating when it was verified
  iss: string // the public key of the CRS in JWK
}
```

### ```POST /dispute```

Authenticated endpoint that can only be accessed by i3-MARKET Consumers.

#### Input

```typescript
{
  por?: string // a the PoR in compact JWS format
  pop?: string // a the PoP in compact JWS format
  cipherblock: string // the cipherblock as a JWE string
}
```

#### Output

It returns a signed resolution as a compact JWS with payload:

```typescript
{
  dataExchangeId: string // the unique id of this data exchange
  badDecryption: boolean // whether the cipherblock could be decrypted or not
  iat: nume // unix timestamp stating when it was verified
  iss: string // the public key of the CRS in JWK
}
```

## Set up the OIDC relying party

If you haven't registered yet a client, point your browser to [https://identity1.i3-market.eu/developers/login](https://identity1.i3-market.eu/developers/login) and use the following credentials to get a valid initial access token for client registration:

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

Copy `config.template.ts` to `config.ts` and fill the OIDC client metadata from those received.

Point your browser to `/oidc/login/consumer` to init a consumer login process, or to `/oidc/login/provider` to init the provider one. You will need to download the i3Market wallet. Once the process is completed, you will get a valid access token that you can use as a bearer token to access the protected resource in `/claim`.
