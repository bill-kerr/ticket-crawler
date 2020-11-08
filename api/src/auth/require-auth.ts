import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/errors';

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    throw new NotAuthorizedError('The Authorization header must be set.');
  }

  const authHeader = req.headers.authorization.split(' ');
  const bearer = authHeader[0];

  if (bearer !== 'Bearer') {
    throw new NotAuthorizedError(
      "The Authorization header must be formatted as 'Bearer <token>' where <token> is a valid auth key."
    );
  }

  const authToken = authHeader[1];
  let user;
  try {
    user = await admin.auth().verifyIdToken(authToken);
  } catch (err) {
    throw new NotAuthorizedError(err.errorInfo.message);
  }

  if (!user) {
    throw new NotAuthorizedError();
  }

  req.userId = user.uid;
  next();
}
