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
         * Expected input is a dispute request as a compact JSON Web Signature (JWS) along with the public key to verify it. For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.
         *
         */
        export interface DisputeInput {
            disputeRequest: /* CompactJWS */ CompactJWS /* ^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$ */;
            publicJwk: string;
        }
        /**
         * SignedResolution
         */
        export interface SignedResolution {
            /**
             * A signed resolution object as a compact JWS signed by the CRS. The payload of a resolution is:
             *
             * ```typescript
             * {
             *   type: 'verification' | 'dispute'
             *   dataExchangeId: string // the unique id of this data exchange
             *   resolution: 'completed' | 'not completed' | 'accepted' | 'denied' // whether the data exchange has been verified to be complete ('completed' | 'not completed') or if a dispute has been 'accpeted' (valid claim) or 'denied'.
             *   iat: nume // unix timestamp stating when it was verified
             *   iss: string // the public key of the CRS in JWK
             * }
             * ```
             *
             */
            signedResolution: any;
        }
        /**
         * VerificationInput
         * Expected input is a verification request as a compact JSON Web Signature (JWS) along with the public key to verify it. For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.
         *
         */
        export interface VerificationInput {
            verificationRequest: /* CompactJWS */ CompactJWS /* ^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$ */;
            publicJwk: string;
        }
    }
}
export namespace OpenApiPaths {
    export namespace Dispute {
        export type RequestBody = /**
         * DisputeInput
         * Expected input is a dispute request as a compact JSON Web Signature (JWS) along with the public key to verify it. For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.
         *
         */
        OpenApiComponents.Schemas.DisputeInput;
        export namespace Responses {
            export type $200 = /* SignedResolution */ OpenApiComponents.Schemas.SignedResolution;
            export type Default = /* Error */ OpenApiComponents.Schemas.ApiError;
        }
    }
    export namespace Verification {
        export type RequestBody = /**
         * VerificationInput
         * Expected input is a verification request as a compact JSON Web Signature (JWS) along with the public key to verify it. For the request to be accepted, it MUST be signed with the same key it was used during the data exchange for this verification.
         *
         */
        OpenApiComponents.Schemas.VerificationInput;
        export namespace Responses {
            export type $200 = /* SignedResolution */ OpenApiComponents.Schemas.SignedResolution;
            export type Default = /* Error */ OpenApiComponents.Schemas.ApiError;
        }
    }
}
