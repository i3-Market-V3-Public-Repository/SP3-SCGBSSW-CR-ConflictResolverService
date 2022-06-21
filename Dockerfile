# Instructions:
# Download this file (you don't need anything else)
# Build: docker build -t crs . 
# Generate keys if you don't have a valid pair : 
#  - [new keys] docker run -it --init crs generateJwks ES256
#  - [using a privatekey in hex] docker run -it --init crs generateJwks ES256 8c2ebb279f950edec15d36f3d7b10a35858d9743f964489ec0ad8860e3e9423b
# Copy .env.template to .env and fill all the required env variables. If OIDC login is enabled, you will need valid OIDC client/RP credentials first.
# Run the Conflict Resolution Service: docker run -it --init -p 127.0.0.1:3000:3000 --env-file .env crs
FROM node:16

# VERSION can be used to build docker with a specific NPM version of the @i3m/conflict-resolver-service
ARG VERSION=${VERSION:-latest}

ENV NODE_ENV=${NODE_ENV:-production}

ENV CORS_ACCESS_CONTROL_ALLOW_ORIGIN=${CORS_ACCESS_CONTROL_ALLOW_ORIGIN:-*}

ENV CRS_PRIVATE_JWK=${CRS_PRIVATE_JWK} CRS_PUBLIC_JWK=${CRS_PUBLIC_JWK}

ENV RPC_PROVIDER_URL=${RPC_PROVIDER_URL}

WORKDIR /app
RUN chown node.node /app
USER node
RUN mkdir .keys && \
    npm install @i3m/conflict-resolver-service@${VERSION}
EXPOSE 3000
ENTRYPOINT [ "npx" ]
CMD [ "crs" ]
