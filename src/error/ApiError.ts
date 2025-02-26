class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message: string): ApiError {
    return new ApiError(401, message);
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
