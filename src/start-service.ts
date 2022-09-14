import axios from 'axios';
import bodyParser from 'body-parser';
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import http from 'http';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import memoize from 'memoizee';

export function startService({
  spec,
  handlers,
}: {
  spec: string;
  handlers: Record<string, RequestHandler>;
}) {
  const app = express();

  app.use(bodyParser.json());

  app.use(
    OpenApiValidator.middleware({
      apiSpec: spec,
      validateFormats: 'full',
      validateRequests: true,
      validateSecurity: {
        handlers: {
          async openId(req, scopes, scheme) {
            /* Skip handler if scheme type is not openIdConnect. */
            if (scheme.type !== 'openIdConnect') {
              return false;
            }

            /* Get token's kid. */
            const token = req.headers.authorization?.split(' ')[1];
            if (token == null) {
              throw new Error('Bearer token is missing.');
            }
            const kid = jwt.decode(token, { complete: true })?.header?.kid;

            /* Check token. */
            const jwkClient = await getJwkClient(scheme.openIdConnectUrl);
            const key = await jwkClient.getSigningKey(kid);
            const claims = jwt.verify(
              token,
              key.getPublicKey()
            ) as jwt.JwtPayload;

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
        basePath: '/',
        resolver: handlerResolver(handlers),
      },
    })
  );

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
const handlerResolver =
  (handlers: Record<string, RequestHandler>) =>
  (_: unknown, route: any, apiDoc: Record<string, any>) => {
    const { basePath, openApiRoute, method } = route;
    const pathKey = openApiRoute.substring(basePath.length);
    const { operationId } = apiDoc.paths[pathKey][method.toLowerCase()];
    return (
      handlers[operationId] ??
      createNotFoundHandler({ method, path: openApiRoute })
    );
  };

const createNotFoundHandler =
  ({ method, path }: { method: string; path: string }): RequestHandler =>
  (_, res) =>
    res.status(501).send({
      type: 'https://errors.marmicode.io/route-not-implemented',
      title: 'Route Not Implemented',
      method,
      path,
    });

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
