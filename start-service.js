import bodyParser from 'body-parser';
import express from 'express';
import OpenApiValidator from 'express-openapi-validator';
import http from 'http';
import jwksClient from 'jwks-rsa';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import memoize from 'memoizee';

export function startService({ handlers }) {
  const openIdConnectMap = new Map();
  const jwksClientMap = new Map();

  const app = express();

  app.use(bodyParser.json());

  app.use(
    OpenApiValidator.middleware({
      apiSpec: './openapi.yaml',
      validateFormats: 'full',
      validateRequests: true,
      validateSecurity: {
        handlers: {
          async openId(req, scopes, scheme) {
            /* Get token's kid. */
            const token = req.headers.authorization?.split(' ')[1];
            if (token == null) {
              throw new Error('Bearer token is missing.');
            }
            const kid = jwt.decode(token, { complete: true })?.header?.kid;

            /* Check token. */
            const jwkClient = await getJwkClient(scheme.openIdConnectUrl);
            const key = await jwkClient.getSigningKeyAsync(kid);
            const claims = jwt.verify(token, key.getPublicKey());

            /* Check scope. */
            const tokenScopes = claims.scope.split(' ');
            for (const scope of scopes) {
              if (!tokenScopes.includes(scope)) {
                throw new Error(`Missing required scopes: ${scopes}`);
              }
            }

            return true;
          },
        },
      },
      operationHandlers: {
        resolver: handlerResolver(handlers),
      },
    })
  );

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  http.createServer(app).listen(3000);
}

/**
 * Custom resolver that maps `operationId`s to functions.
 */
const handlerResolver = (handlers) => (_, route, apiDoc) => {
  const { basePath, openApiRoute, method } = route;
  const pathKey = openApiRoute.substring(basePath.length);
  const { operationId } = apiDoc.paths[pathKey][method.toLowerCase()];
  return handlers[operationId];
};

/**
 * Get JwkClient from open id config.
 */
const getJwkClient = memoize(async (openIdConnectUrl) => {
  const { data } = await axios.get(openIdConnectUrl);
  const jwksUri = data['jwks_uri'];

  return jwksClient({
    jwksUri,
  });
});
