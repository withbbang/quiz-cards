import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  CustomWindow,
  TypeJavascriptInterface,
  TypeKeyValueForm,
  TypeThrowCustomErrorInAPI,
  TypeThrowErrorInAPI,
} from './types';
import {
  BadGatewayError,
  BadRequestError,
  CustomAPIError,
  ForbiddenError,
  InternalServerErrorError,
  MethodNotAllowedError,
  NativeError,
  NotFoundError,
  RequestTimeoutError,
  ServiceUnavailableError,
  UnauthorizedError,
} from './customErrorClasses';

/**
 * firebase 초기화
 */
export const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APP_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

/**
 * firebase 인가 가져오기
 */
export const auth = getAuth(app);

/**
 * firebase 객체 가져오기
 */
export const db = getFirestore(app);

/**
 * [API 상태 코드에 따른 에러 발생 함수]
 *
 * 상태코드, 에러 메세지, 에러팝업 콜백 함수 담고 있는 파라미터 객체
 * @param {TypeThrowErrorInAPI} parameters
 */
export function handleThrowErrorInAPI({
  status,
  message = 'You should set default error message',
  failCb,
}: TypeThrowErrorInAPI) {
  failCb?.();
  switch (status) {
    case 400:
      throw new BadRequestError(message);
    case 401:
      throw new UnauthorizedError(message);
    case 403:
      throw new ForbiddenError(message);
    case 404:
      throw new NotFoundError(message);
    case 405:
      throw new MethodNotAllowedError(message);
    case 408:
      throw new RequestTimeoutError(message);
    case 500:
      throw new InternalServerErrorError(message);
    case 502:
      throw new BadGatewayError(message);
    case 503:
      throw new ServiceUnavailableError(message);
    default:
      break;
  }
}

/**
 * [Status Code는 정상이지만 서버 로직에 의한 에러 발생 함수]
 *
 * 코드, 에러 메세지, 에러팝업 콜백 함수 담고 있는 파라미터 객체
 * @param {TypeThrowErrorInAPI} parameters
 */
export function handleThrowCustomErrorInAPI({
  code,
  message = 'You should set default error message',
  failCb,
}: TypeThrowCustomErrorInAPI) {
  failCb?.(code, message);
  // TODO: 코드에 따라 switch case 분기 필요
  throw new CustomAPIError(message);
}

/**
 * [화면 접근 OS 반환 함수]
 *
 * @returns {string}
 */
export function handleGetOsType(): string {
  const { userAgent } = navigator;

  if (/android/i.test(userAgent)) {
    return 'AND';
  }

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'IOS';
  }

  return 'BACK';
}

/**
 * [AOS용 Javascript Interface 호출 함수]
 *
 * @param {TypeJavascriptInterface} params bridge, action, data, hasCb, isActiveErrorPopup 들고 있는 객체
 * @returns {Promise<any>}
 */
export function handleJavascriptInterfaceForAOS({
  bridge,
  action,
  data,
  isActiveErrorPopup,
}: TypeJavascriptInterface): Promise<any> {
  return new Promise((resolve, reject) => {
    const interfaceNm = bridge as keyof Window;

    try {
      if (window[interfaceNm] && window[interfaceNm][action]) {
        if (data !== undefined) resolve(window[interfaceNm][action](data));
        else resolve(window[interfaceNm][action]());
      } else {
        if (!isActiveErrorPopup) throw new NativeError();

        throw Error(
          `Native에서 [${interfaceNm} ${action}]와 관련된 데이터를 가져올 수 없습니다.`,
        );
      }
    } catch (error: any) {
      reject(error);
    }
  });
}

/**
 * [IOS용 Javascript Interface 호출 함수]
 *
 * @param {TypeJavascriptInterface} params bridge, action, data, hasCb 들고 있는 객체
 * @returns {Promise<any>}
 */
export function handleJavascriptInterfaceForIOS({
  bridge,
  action,
  data,
  hasCb,
  isActiveErrorPopup,
}: TypeJavascriptInterface): Promise<any> {
  return new Promise((resolve, reject) => {
    const { webkit } = window as CustomWindow;
    const callbackName = `callback${action.replace(/\b[a-z]/, (letter) =>
      letter.toUpperCase(),
    )}`;

    try {
      if (webkit.messageHandlers[bridge])
        if (hasCb) {
          (window as any)[callbackName] = resolve;

          webkit.messageHandlers[bridge].postMessage({
            action,
            data,
          });
        } else
          resolve(
            webkit.messageHandlers[bridge].postMessage({
              action,
              data,
            }),
          );
      else {
        if (!isActiveErrorPopup) throw new NativeError();

        throw Error(
          `Native에서 [${bridge}]와 관련된 데이터를 가져올 수 없습니다.`,
        );
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * [Javascript Interface 호출 함수]
 *
 * @param {TypeJavascriptInterface} params bridge, action, data, hasCb 들고 있는 객체
 * @returns {Promise<any>}
 */
export async function handleJavascriptInterface({
  bridge,
  action,
  data,
  hasCb,
  isActiveErrorPopup,
}: TypeJavascriptInterface): Promise<any> {
  if (handleGetOsType() === 'AND')
    return handleJavascriptInterfaceForAOS({
      bridge,
      action,
      data,
      isActiveErrorPopup,
    });

  if (handleGetOsType() === 'IOS')
    return handleJavascriptInterfaceForIOS({
      bridge,
      action,
      data,
      hasCb,
      isActiveErrorPopup,
    });

  return '';
}

/**
 * [javascript interface 리턴값 파싱 함수]
 *
 * @param {TypeJavascriptInterface} params bridge, action, data, hasCb 들고 있는 객체
 * @returns
 */
export async function handleParseDataFromJSInterface({
  bridge,
  action,
  data,
  hasCb,
  isActiveErrorPopup,
}: TypeJavascriptInterface): Promise<any> {
  const value = await handleJavascriptInterface({
    bridge,
    action,
    data,
    hasCb,
    isActiveErrorPopup,
  });

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

/**
 * Promise가 포함된 API 파라미터 객체, 동기적으로 resolve 시키기 위한 함수
 * @param {any} params API 파라미터 객체
 * @returns {Promise<TypeKeyValueForm>} resolve된 파라미터 객체
 */
export async function handleSetParamsWithSync(
  params: any,
): Promise<TypeKeyValueForm> {
  const newParams: TypeKeyValueForm = {};
  const keyArray: string[] = [];
  const promiseValueArray: any[] = [];

  Object.entries(params).forEach(([key, value]) => {
    keyArray.push(key);
    promiseValueArray.push(
      new Promise<string | number>((resolve, reject) => {
        try {
          resolve(value as string | number);
        } catch (error: any) {
          reject(error);
        }
      }),
    );
  });

  const valueArray: (string | number)[] = await Promise.all(promiseValueArray);

  keyArray.forEach((key, idx) => {
    newParams[key] = valueArray[idx];
  });

  return newParams;
}

/**
 * 입력 시간을 원하는 포맷으로 변환해주는 함수
 * @param {Date} date 변환하고 싶은 날짜
 * @param {string} format 반환할 포맷
 * @returns {string} 변환된 포맷 날짜 혹은 시간값
 */
export function handleConvertDateFormat(date: Date, format: string): string {
  switch (format) {
    case 'yyyy-mm-dd':
      return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
        2,
        '0',
      )}-${`${date.getDate() + 1}`.padStart(2, '0')}`;
    case 'yyyymmdd':
      return `${date.getFullYear()}${`${date.getMonth() + 1}`.padStart(
        2,
        '0',
      )}${`${date.getDate() + 1}`.padStart(2, '0')}`;
    case 'yyyyMMddhhmmss':
      const handleSetPadZero = (value: number) =>
        value < 10 ? `0${value}` : value;
      return `${date.getFullYear()}${handleSetPadZero(
        date.getMonth() + 1,
      )}${handleSetPadZero(date.getDate())}${handleSetPadZero(
        date.getHours(),
      )}${handleSetPadZero(date.getMinutes())}${handleSetPadZero(
        date.getSeconds(),
      )}`;
    default:
      return '';
  }
}

/**
 * timestamp를 원하는 형식으로 반환 함수
 *
 * @param {string} timestamp
 * @param {string} format
 * @returns {string}
 */
export function handleConvertTimestamp(
  timestamp: string,
  format: string,
): string {
  const date = new Date(timestamp);

  switch (format) {
    case 'yyyy-MM-dd':
      return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
        2,
        '0',
      )}-${`${date.getDate()}`.padStart(2, '0')}`;
    case 'yyyyMMdd':
      return `${date.getFullYear()}${`${date.getMonth() + 1}`.padStart(
        2,
        '0',
      )}${`${date.getDate()}`.padStart(2, '0')}`;
    case 'yyyyMMddhhmmss':
      const handleSetPadZero = (value: number) =>
        value < 10 ? `0${value}` : value;
      return `${date.getFullYear()}${handleSetPadZero(
        date.getMonth() + 1,
      )}${handleSetPadZero(date.getDate())}${handleSetPadZero(
        date.getHours(),
      )}${handleSetPadZero(date.getMinutes())}${handleSetPadZero(
        date.getSeconds(),
      )}`;
    default:
      return '';
  }
}

/**
 * 문자열 첫번째 글자만 대문자로 변환시키는 함수
 * @param {string} value 변환될 값
 * @returns {string} 변환된 값
 */
export function handleSetUpperCaseFirstCharacter(value: string): string {
  return value.replace(/^[a-z]/, (char) => char.toUpperCase());
}

/**
 * 이메일 포맷 검증 함수
 * @param {string} email 이메일
 * @returns {boolean}
 */
export function handleCheckEmail(email: string): boolean {
  // eslint-disable-next-line
  return /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(email);
}

/**
 * 빈 파라미터 체크 함수
 * @param params 검사할 파라미터
 * @param cb 성공시 콜백 함수
 */
export function handleCheckEmpty(params: any, cb: Function) {
  if (
    params !== undefined &&
    params !== null &&
    params !== ''
    // params === false &&
    // params === 0 &&
    // Number.isNaN(params)
  ) {
    cb();
  }
}
