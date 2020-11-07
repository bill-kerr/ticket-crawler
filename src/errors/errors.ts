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

  serialize() {
    return [this.error];
  }
}
