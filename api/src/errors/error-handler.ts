import { Request, Response, NextFunction } from 'express';
import { BaseError, ErrorResponse, HttpResponseCode } from './error-types';

const defaultError = (requestUrl: string): ErrorResponse => ({
  object: 'error',
  statusCode: HttpResponseCode.INTERNAL_SERVER_ERROR,
  requestUrl,
  errors: [
    {
      object: 'error-detail',
      title: 'Internal server error',
      detail: 'An unknown error occurred.',
    },
  ],
});

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof BaseError) {
    const errorResponse: ErrorResponse = {
      object: 'error',
      statusCode: err.statusCode,
      requestUrl: req.url,
      errors: err.serialize(),
    };

    return res.status(errorResponse.statusCode).json(errorResponse);
  }

  if (err instanceof SyntaxError) {
    const errorResponse: ErrorResponse = {
      object: 'error',
      statusCode: HttpResponseCode.BAD_REQUEST,
      requestUrl: req.originalUrl,
      errors: [
        {
          object: 'error-detail',
          title: 'Syntax error',
          detail: 'Request contained invalid JSON.',
        },
      ],
    };

    return res.status(HttpResponseCode.BAD_REQUEST).json(errorResponse);
  }

  console.error(err);
  return res.status(HttpResponseCode.INTERNAL_SERVER_ERROR).json(defaultError(req.originalUrl));
}
