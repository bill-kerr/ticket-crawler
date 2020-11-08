import { HttpResponseCode, SerializedError, BaseError } from './error-types';

export class NotAuthorizedError extends BaseError {
  statusCode = HttpResponseCode.UNAUTHORIZED;
  error: SerializedError = {
    object: 'error-detail',
    title: 'Not authorized',
    detail: '',
  };

  constructor(message = 'User is not authorized to access this resource.') {
    super(message);
    this.error.detail = message;
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serialize = () => [this.error];
}

export class NotFoundError extends BaseError {
  statusCode = HttpResponseCode.NOT_FOUND;
  error: SerializedError = {
    object: 'error-detail',
    title: 'Not found',
    detail: '',
  };

  constructor(message = 'The requested resource was not found.') {
    super(message);
    this.error.detail = message;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize = () => [this.error];
}
