export enum HttpResponseCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  UNSUPPORTED_MEDIA_TYPE = 415,
  INTERNAL_SERVER_ERROR = 500,
}

export interface SerializedError {
  object: 'error-detail';
  title: string;
  detail: string;
}

export abstract class BaseError extends Error {
  abstract statusCode: HttpResponseCode;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serialize(): SerializedError[];
}

export interface ErrorResponse {
  object: 'error';
  statusCode: HttpResponseCode;
  requestUrl: string;
  errors: SerializedError[];
}
