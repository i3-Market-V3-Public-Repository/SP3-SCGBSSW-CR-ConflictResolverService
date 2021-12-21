export namespace OpenApiComponents {
    export namespace Schemas {
        /**
         * Error
         */
        export interface ApiError {
            name: string;
            description: string;
        }
        /**
         * CompactJWS
         */
        export type CompactJWS = string // ^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$
        /**
         * DisputeInput
         * A dispute request as a compact JSON Web Signature (JWS). For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.
         *
         * The payload of a decoded `disputeRequest` holds a valid PoR, and the received cipherblock:
         *
         * ```typescript
         * {
         *   proofType: 'request'
         *   type: 'disputeRequest'
         *   iss: 'dest'
         *   cipherblock: string // the cipherblock as a JWE string
         *   iat: number // unix timestamp for issued at
         *   por: string // a compact JWS holding a PoR. The proof MUST be signed with the same key as either 'orig' or 'dest' of the payload proof.
         *   dataExchangeId: string // the unique id of this data exchange
         * }
         * ```
         *
         */
        export interface DisputeInput {
            disputeRequest: /* CompactJWS */ CompactJWS /* ^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$ */;
        }
        /**
         * SignedResolution
         * A signed resolution object as a compact JWS signed by the CRS. The payload of a resolution is:
         *
         * ```typescript
         * {
         *   proofType: 'resolution'
         *   type: 'verification' | 'dispute'
         *   resolution: 'completed' | 'not completed' | 'accepted' | 'denied'
         *   dataExchangeId: string // the unique id of this data exchange
         *   iat: number // unix timestamp stating when it was resolved
         *   iss: string // the public key of the CRS as a JWK
         *   sub: string // the public key (JWK) of the entity that requested a resolution
         * }
         * ```
         *
         * If `type` is `verification`, `resolution` can be `completed` (the non-repudiation protocol has been verified to be completed) or `not completed`.
         *
         * If `type` is `dispute`, `resolution` accepted (the CRS has verified that the cipherblock exchanged cannot be decrypted) or `denied`.
         *
         */
        export interface SignedResolution {
            signedResolution: /* CompactJWS */ CompactJWS /* ^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$ */;
        }
        /**
         * VerificationInput
         * A verification request is a JWS signed by either the consumer or the provider using the same key he/she used for the data exchange. The verification request payload holds a valid PoR:
         *
         * ```typescript
         * {
         *   type: 'verificationRequest'
         *   proofType: 'request'
         *   iss: 'orig' | 'dest'
         *   iat: number // unix timestamp for issued at
         *   por: string // a compact JWS holding a PoR. The proof MUST be signed with the same key as either 'orig' or 'dest' of the payload proof.
         *   dataExchangeId: string // the unique id of this data exchange
         * }
         * ```
         *
         */
        export interface VerificationInput {
            verificationRequest: /* CompactJWS */ CompactJWS /* ^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$ */;
        }
    }
}
export namespace OpenApiPaths {
    export namespace Dispute {
        export namespace Post {
            export type RequestBody = /**
             * DisputeInput
             * A dispute request as a compact JSON Web Signature (JWS). For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.
             *
             * The payload of a decoded `disputeRequest` holds a valid PoR, and the received cipherblock:
             *
             * ```typescript
             * {
             *   proofType: 'request'
             *   type: 'disputeRequest'
             *   iss: 'dest'
             *   cipherblock: string // the cipherblock as a JWE string
             *   iat: number // unix timestamp for issued at
             *   por: string // a compact JWS holding a PoR. The proof MUST be signed with the same key as either 'orig' or 'dest' of the payload proof.
             *   dataExchangeId: string // the unique id of this data exchange
             * }
             * ```
             *
             */
            OpenApiComponents.Schemas.DisputeInput;
            export namespace Responses {
                export type $200 = /**
                 * SignedResolution
                 * A signed resolution object as a compact JWS signed by the CRS. The payload of a resolution is:
                 *
                 * ```typescript
                 * {
                 *   proofType: 'resolution'
                 *   type: 'verification' | 'dispute'
                 *   resolution: 'completed' | 'not completed' | 'accepted' | 'denied'
                 *   dataExchangeId: string // the unique id of this data exchange
                 *   iat: number // unix timestamp stating when it was resolved
                 *   iss: string // the public key of the CRS as a JWK
                 *   sub: string // the public key (JWK) of the entity that requested a resolution
                 * }
                 * ```
                 *
                 * If `type` is `verification`, `resolution` can be `completed` (the non-repudiation protocol has been verified to be completed) or `not completed`.
                 *
                 * If `type` is `dispute`, `resolution` accepted (the CRS has verified that the cipherblock exchanged cannot be decrypted) or `denied`.
                 *
                 */
                OpenApiComponents.Schemas.SignedResolution;
                export type Default = /* Error */ OpenApiComponents.Schemas.ApiError;
            }
        }
    }
    export namespace Verification {
        export namespace Post {
            export type RequestBody = /**
             * VerificationInput
             * A verification request is a JWS signed by either the consumer or the provider using the same key he/she used for the data exchange. The verification request payload holds a valid PoR:
             *
             * ```typescript
             * {
             *   type: 'verificationRequest'
             *   proofType: 'request'
             *   iss: 'orig' | 'dest'
             *   iat: number // unix timestamp for issued at
             *   por: string // a compact JWS holding a PoR. The proof MUST be signed with the same key as either 'orig' or 'dest' of the payload proof.
             *   dataExchangeId: string // the unique id of this data exchange
             * }
             * ```
             *
             */
            OpenApiComponents.Schemas.VerificationInput;
            export namespace Responses {
                export type $200 = /**
                 * SignedResolution
                 * A signed resolution object as a compact JWS signed by the CRS. The payload of a resolution is:
                 *
                 * ```typescript
                 * {
                 *   proofType: 'resolution'
                 *   type: 'verification' | 'dispute'
                 *   resolution: 'completed' | 'not completed' | 'accepted' | 'denied'
                 *   dataExchangeId: string // the unique id of this data exchange
                 *   iat: number // unix timestamp stating when it was resolved
                 *   iss: string // the public key of the CRS as a JWK
                 *   sub: string // the public key (JWK) of the entity that requested a resolution
                 * }
                 * ```
                 *
                 * If `type` is `verification`, `resolution` can be `completed` (the non-repudiation protocol has been verified to be completed) or `not completed`.
                 *
                 * If `type` is `dispute`, `resolution` accepted (the CRS has verified that the cipherblock exchanged cannot be decrypted) or `denied`.
                 *
                 */
                OpenApiComponents.Schemas.SignedResolution;
                export type Default = /* Error */ OpenApiComponents.Schemas.ApiError;
            }
        }
    }
}
