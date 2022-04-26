[![License: EUPL-1.2](https://img.shields.io/badge/license-EUPL--1.2-green.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Conflict Resolver Service

The Conflict-Resolver Service (CSR) can be queried to provide a signed resolution about the non-repudiation protocol associated to an invoice being valid or invalid. It could be invoked by either the consumer or the provider.

Check the OAS specification at [CRS OAS](https://github.com/i3-Market-V2-Public-Repository/SP3-SCGBSSW-CR-ConflictResolverService/blob/public/spec/openapi.yaml).

It is a core element of the Conflict Resolution system in i3-MARKET. [Read more here](https://github.com/i3-Market-V2-Public-Repository/SP3-SCGBSSW-CR-Documentation#conflict-resolution--non-repudiation-protocol).

- [1. Endpoints](#1-endpoints)
  - [1.1. ```POST /verification```](#11-post-verification)
    - [1.1.1. Input](#111-input)
    - [1.1.2. Output](#112-output)
  - [1.2. ```POST /dispute```](#12-post-dispute)
    - [1.2.1. Input](#121-input)
    - [1.2.2. Output](#122-output)
- [2. Local setup](#2-local-setup)
  - [2.1. NPM](#21-npm)
  - [2.2. Docker](#22-docker)

## 1. Endpoints

The Conflict-Resolver Service provides two endpoints: one for checking that the protocol was executed properly, and other one to initiate a dispute when a Consumer B claims that he cannot decrypt the cipherblock he has been invoiced for.

Check the [OpenApi specification](https://github.com/i3-Market-V2-Public-Repository/SP3-SCGBSSW-CR-ConflictResolverService/blob/public/spec/openapi.yaml) for more details.

The endpoints require JWT bearer authentication. The JWT can be obtained after performing a login with OIDC and presenting valid i3-MARKET credentials.

### 1.1. ```POST /verification```

The Conflict-Resolver Service (CSR) can be queried to provide a signed resolution about a data exchanged successfully performed or not. It could be invoked by either the consumer or the provider. The provider should query this endpoint and send it along with the invoice to the consumer.

This endpoint can be accessed at `POST /verification` and is requires valid i3-MARKET Consumer or Provider's credentials.

#### 1.1.1. Input

A verification request as a compact JSON Web Signature (JWS). For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.

```typescript
{
  verificationRequest: string // the verification request in compact JWS format
}
```

A verification request is a JWS signed by either the consumer or the provider using the same key he/she used for the data exchange. The verification request payload holds a valid PoR:

```typescript
{
  type: 'verificationRequest'
  proofType: 'request'
  iss: 'orig' | 'dest'
  iat: number // unix timestamp for issued at
  por: string // a compact JWS holding a PoR. The proof MUST be signed with the same key as either 'orig' or 'dest' of the payload proof.
  dataExchangeId: string // the unique id of this data exchange
}
```

#### 1.1.2. Output

It returns a signed resolution as a compact JWS with payload:

```typescript
{
  proofType: 'resolution'
  type: 'verification'
  resolution: 'completed' | 'not completed' // whether the data exchange has been verified to be complete
  dataExchangeId: string // the unique id of this data exchange
  iat: number // unix timestamp stating when it was resolved
  iss: string // the public key of the CRS in JWK
  sub: string // the public key (JWK) of the entity that requested a resolution
}
```

### 1.2. ```POST /dispute```

Notice that the signed resolution obtained from `POST /verification` does not ensure that the published secret could be used to decrypt the encrypted block of data. If the consumer B is not able to decrypt the cipherblock, he could initiate a dispute on the CRS. The CRS will also provide signed resolution of whether B is right or not.

All this is handled in this endpoint, which can only be queried if in possession of valid i3-MARKET Consumer's credentials.

#### 1.2.1. Input

```typescript
{
  disputeRequest: string // the dispute request in compact JWS format
}
```

A dispute request as a compact JSON Web Signature (JWS). For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.

The payload of a decoded `disputeRequest` holds a valid PoR, and the received cipherblock:

```typescript
{
  proofType: 'request'
  type: 'disputeRequest'
  iss: 'dest'
  cipherblock: string // the cipherblock as a JWE string
  iat: number // unix timestamp for issued at
  por: string // a compact JWS holding a PoR. The proof MUST be signed with the same key as either 'orig' or 'dest' of the payload proof.
  dataExchangeId: string // the unique id of this data exchange
}
```

#### 1.2.2. Output

It returns a signed resolution as a compact JWS with payload:

```typescript
{
  proofType: 'resolution'
  type: 'dispute'
  resolution: 'accepted' | 'denied' // resolution is 'denied' if the cipherblock can be properly decrypted; otherwise is 'accepted'
  dataExchangeId: string // the unique id of this data exchange
  iat: number // unix timestamp stating when it was resolved
  iss: string // the public key of the CRS in JWK
  sub: string // the public key (JWK) of the entity that requested a resolution
}
```

## 2. Local setup

You can get a local instance (for development) up and running with NPM or Docker

### 2.1. NPM

Install the service as:

```console
npm install @i3m/conflict-resolver-service
```

Copy [`template.env`](./template.env) into that directory and name it `.env`.

Fill in the required variables (it is self-explanatory).

You need a pair of private/public keys in JWK format. If you don't have them, you can create them as:

- [new keys] `npx generateJwks ES256`
- [using a privatekey in hex] `node generateJwks ES256 <your private key in hex>`

> Just call `npx generateJwks -h` for further help.

You must also state an RPC endpoint for accessing the ledger `RPC_PROVIDER_URL`

Run your conflict-resolution service as:

```console
npx crs
```

### 2.2. Docker

Download [`Dockerfile`](./Dockerfile) to a directory. From that directory, built it as:

```console
docker build -t crs . 
```

Copy [`template.env`](./template.env) into that directory and name it `.env`.

Fill in the required variables (it is self-explanatory).

You need a pair of private/public keys in JWK format. If you don't have them, you can create them as:

- [new keys] `docker run -it --init crs generateJwks ES256`
- [using a privatekey in hex] `docker run -it --init crs generateJwks ES256 <your private key in hex>`

> Just call `docker run -it --init crs generateJwks -h` for further help.

Run your conflict-resolution service as:

```console
docker run -it --init -p 127.0.0.1:3000:3000 --env-file .env crs
```

> Notice that we are just exposing `localhost` at tcp port 3000. Use the configuration you need. In production, you will likely have it behind a reverse proxy providing TLS.
