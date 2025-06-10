export class APIError extends Error {
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }

  redirectUrl: string = '/';
  notFound: boolean = false;
  code?: string = '000000';
  name: string = 'API Error';
}

// 400
export class BadRequestError extends APIError {
  constructor(message: string = 'Bad Request Error') {
    super(message);
  }

  name = 'Bad Request Error';
}

// 401
export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized Error') {
    super(message);
  }

  name = 'Unauthorized Error';
}

// 403
export class ForbiddenError extends APIError {
  constructor(message: string = 'Forbidden Error') {
    super(message);
  }

  name = 'Forbidden Error';
}

// 404
export class NotFoundError extends APIError {
  constructor(message: string = 'Not Found Error') {
    super(message);
  }

  name = 'Not Found Error';
  notFound = true;
}

// 405
export class MethodNotAllowedError extends APIError {
  constructor(message: string = 'Method Not Allowed Error') {
    super(message);
  }

  name = 'Method Not Allowed Error';
}

// 408
export class RequestTimeoutError extends APIError {
  constructor(message: string = 'Request Timeout Error') {
    super(message);
  }

  name = 'Request Timeout Error';
}

// 500
export class InternalServerErrorError extends APIError {
  constructor(message: string = 'Internal Server Error Error') {
    super(message);
  }

  name = 'Internal Server Error Error';
}

// 502
export class BadGatewayError extends APIError {
  constructor(message: string = 'Bad Gateway Error') {
    super(message);
  }

  name = 'Bad Gateway Error';
}

// 503
export class ServiceUnavailableError extends APIError {
  constructor(message: string = 'Service Unavailable Error') {
    super(message);
  }

  name = 'Service Unavailable Error';
}

// Status Code는 정상이지만 서버 로직에 의한 에러
export class CustomAPIError extends APIError {
  constructor(message: string = 'Custom API Error') {
    super(message);
  }

  name = 'Custom API Error';
}

// JS Interface로 인한 커스텀 에러
export class NativeError extends Error {
  constructor(message: string = 'Unkown JS Interface') {
    super(message);
  }

  name: string = 'Native Error';
}

// 토스트 팝업 표시를 위한 클래스
export class ToastError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class BeforeErrorPopupThenStopLogic extends Error {
  constructor(message: string) {
    super(message);
  }

  name: string = 'Error Occurred Before Popup And Then Stop Logic';
}

export class BeforeErrorPopupThenNonStopLogic extends Error {
  constructor(message?: string) {
    super(message);
  }

  name: string = 'Error Occurred Before Popup And Then No Stop Logic';
}

export class AfterErrorPopupThenStopLogic extends Error {
  constructor(message: string) {
    super(message);
  }

  name: string = 'Error Occurred After Popup And Then Stop Logic';
}

export class AfterErrorPopupThenNonStopLogic extends Error {
  constructor(message: string) {
    super(message);
  }

  name: string = 'Error Occurred After Popup And Then No Stop Logic';
}
