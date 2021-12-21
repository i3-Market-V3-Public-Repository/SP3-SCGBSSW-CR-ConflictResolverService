# Instructions:
# Download this file (you don't need anything else)
# Build: docker build -t crs . 
# Generate keys if you don't have a valid pair : 
#  - [new keys] docker run -it --init crs generateJwks ES256
#  - [using a privatekey in hex] docker run -it --init crs generateJwks ES256 8c2ebb279f950edec15d36f3d7b10a35858d9743f964489ec0ad8860e3e9423b
# Copy .env.template to .env and fill all the required env variables. If OIDC login is enabled, you will need valid OIDC client/RP credentials first.
# Run the Conflict Resolution Service: docker run -it --init -p 127.0.0.1:3000:3000 --env-file .env crs
FROM node:lts

ENV NODE_ENV=${NODE_ENV:-production}
ENV VERSION=${VERSION:-latest}

ENV SERVER_PORT=${SERVER_PORT:-3000} SERVER_ADDRESS=${SERVER_ADDRESS:+0.0.0.0}

ENV CORS_ACCESS_CONTROL_ALLOW_ORIGIN=${CORS_ACCESS_CONTROL_ALLOW_ORIGIN:-*}

ENV PRIVATE_JWK={PRIVATE_JWK} PUBLIC_JWK={PUBLIC_JWK}

ENV DLT_RPC_PROVIDER_URL=${DLT_RPC_PROVIDER_URL:-http://***REMOVED***:8545}

WORKDIR /app
RUN chown node.node /app
USER node
RUN echo "registry=http://***REMOVED***:8081/repository/i3m-npm-proxy\n@i3m:registry=http://***REMOVED***:8081/repository/i3m-npm-registry" > .npmrc \
  && npm install @i3m/conflict-resolver-service@${VERSION}
EXPOSE ${SERVER_PORT}
ENTRYPOINT [ "npx" ]
CMD [ "crs" ]
