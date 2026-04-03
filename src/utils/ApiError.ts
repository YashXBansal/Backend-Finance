export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code: string = "ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(msg: string) {
    return new ApiError(400, msg, "BAD_REQUEST");
  }

  static unauthorized(msg = "Unauthorized") {
    return new ApiError(401, msg, "UNAUTHORIZED");
  }

  static forbidden(msg = "Insufficient permissions") {
    return new ApiError(403, msg, "FORBIDDEN");
  }

  static notFound(msg: string) {
    return new ApiError(404, msg, "NOT_FOUND");
  }
}
