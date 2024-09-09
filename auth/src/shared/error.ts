export interface ErrorResponse {
  message: string;
  [key: string]: any;
}

export const normalizeError = (errorMsg: any, other = {}) => {
  return {
    message: errorMsg,
    ...other,
  };
};

export abstract class CustomError extends Error {
  constructor(
    public errorMessage: any,
    private code = 400,
  ) {
    super(errorMessage);
  }

  public serializeError(info: any = {}): ErrorResponse {
    return normalizeError(this.errorMessage, info);
  }

  get statusCode(): number {
    return this.code;
  }
}

export class BadRequestError extends CustomError {
  constructor(errorMessage = 'Bad request') {
    super(errorMessage, 400);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class NotAuthorizedError extends CustomError {
  constructor(errorMessage = 'Not authorized') {
    super(errorMessage, 401);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
}
