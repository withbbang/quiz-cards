export interface TypeKeyValueForm {
  [key: string]: number | string;
}

/**
 * [커스텀 window 타입]
 *
 * Native -> Web 호출을 위함
 */
export interface CustomWindow extends Window {
  webkit?: any;
  goBack?: (data?: any) => any;
  onResult?: (data?: any) => any;
  onResume?: (data?: any) => any;
  // TODO: add others...
}

/**
 * [API 네트워크 에러가 났을 경우 호출되는 함수(handleThrowErrorInAPI)의 파라미터 타입]
 *
 * @type {number} status: 상태코드
 * @type {string | undefined} message: 메세지
 * @type {Function | undefined} failCb: API 실패시 바로 실행하는 콜백
 */
export interface TypeThrowErrorInAPI {
  status: number;
  message?: string;
  failCb?: (code?: string, message?: string) => any;
}

/**
 * [Status Code는 정상이지만 서버 로직에 의한 에러 타입]
 *
 * @type {string} code: 결과 코드
 * @type {string | undefined} message: 메세지
 * @type {Function | undefined} failCb: API 실패시 바로 실행하는 콜백
 */
export interface TypeThrowCustomErrorInAPI {
  code: string;
  message: string;
  failCb?: (code?: string, message?: string) => any;
}

/**
 * [Get API 호출 커스텀 훅 파라미터 타입]
 *
 * @type {string} url: api url
 * @type {Function | undefined} beforeCb: 요청 전 콜백
 * @type {Function | undefined} successCb: API 성공시 바로 실행하는 콜백
 * @type {Function | undefined} failCb: API 실패시 바로 실행하는 콜백
 * @type {Function | undefined} errorPopupBtnCb: 에러팝업 버튼 콜백
 */
export interface TypeGetAPIHookParams {
  url: string;
  beforeCb?: () => any;
  successCb?: (response?: any) => any;
  failCb?: (code?: string, message?: string) => any;
  errorPopupBtnCb?: (code?: string) => any;
}

/**
 * [Post API 호출 커스텀 훅 파라미터 타입]
 *
 * @type {string} url: api url
 * @type {string | undefined} url: api url
 * @type {Function | undefined} beforeCb: 요청 전 콜백
 * @type {Function | undefined} successCb: API 성공시 바로 실행하는 콜백
 * @type {Function | undefined} failCb: API 실패시 바로 실행하는 콜백
 * @type {Function | undefined} errorPopupBtnCb: 에러팝업 버튼 콜백
 */
export interface TypePostAPIHookParams {
  url: string;
  beforeCb?: () => any;
  successCb?: (response?: any) => any;
  failCb?: (code?: string, message?: string) => any;
  errorPopupBtnCb?: (code?: string) => any;
}

/**
 * [Post API 확인 팝업 호출 커스텀 훅 파라미터 타입]
 *
 * @type {string} message: 팝업 메세지
 * @type {string} url: api url
 * @type {string | undefined} confirmBtnText: 확인 버튼 텍스트
 * @type {string | undefined} cancelBtnText: 취소 버튼 텍스트
 * @type {Function | undefined} beforeCb: 요청 전 콜백
 * @type {Function | undefined} successCb: API 성공시 바로 실행하는 콜백
 * @type {Function | undefined} cancelBtnCb: 확인 팝업 취소 버튼 콜백
 * @type {Function | undefined} failCb: API 실패시 바로 실행하는 콜백
 * @type {Function | undefined} errorPopupBtnCb: 에러팝업 버튼 콜백
 */
export interface TypePostAPIByConfirmPopupHook {
  message: string;
  url: string;
  confirmBtnText?: string;
  cancelBtnText?: string;
  beforeCb?: () => any;
  successCb?: (response?: any) => any;
  cancelBtnCb?: () => any;
  failCb?: (code?: string, message?: string) => any;
  errorPopupBtnCb?: (code?: string) => any;
}

/**
 * [일반 확인 팝업 커스텀 훅 파라미터 타입]
 *
 * @type {string} message: 팝업 메세지
 * @type {string | undefined} confirmBtnText: 확인 팝업의 확인 버튼 텍스트
 * @type {string | undefined} cancelBtnText: 확인 팝업의 취소 버튼 텍스트
 * @type {Function | undefined} confirmCb: 확인 팝업 확인 버튼 콜백
 * @type {Function | undefined} cancelBtnCb: 확인 팝업 취소 버튼 콜백
 */
export interface TypeNormalConfirmPopupHook {
  message: string;
  confirmBtnText?: string;
  cancelBtnText?: string;
  confirmCb?: () => any;
  cancelBtnCb?: () => any;
}

/**
 * [Javascript Interface 호출 전용 타입]
 *
 * Web -> Native 호출을 위함
 *
 * @type {string} action: 액션 이름
 * @type {string} bridge: 브릿지 이름
 * @type {any | undefined} data: Native에 전달할 데이터
 * @type {boolean | undefined} hasCb: js interface 요청 후 콜백 있는지 여부
 * @type {boolean | undefined} isActiveErrorPopup: JS Interface로 인한 에러 팝업 노출 여부
 */
export interface TypeJavascriptInterface {
  action: string;
  bridge: string;
  data?: any;
  hasCb?: boolean;
  isActiveErrorPopup?: boolean;
}

export interface SVGProps {
  type?: string;
  width?: string;
  height?: string;
  fill?: string;
  stroke?: string;
}
