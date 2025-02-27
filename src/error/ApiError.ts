class ApiError extends Error {
  status: number;
  errors?: any;

  constructor(status: number, message: string, errors?: any) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, errors?: any): ApiError {
    console.log(message, errors);

    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message: string): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  static internal(message: string): ApiError {
    return new ApiError(500, message);
  }
}

export default ApiError;
