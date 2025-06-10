import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useSetErrorBtnCb,
  useSetConfirmBtnCb,
  useSetCancelBtnCb,
  useSetIsErrorPopupActive,
  useSetIsConfirmPopupActive,
  useSetIsLoading,
  useSetMessage,
  useSetErrorMessage,
  useSetConfirmBtnText,
  useSetCancelBtnText,
  useSetInfoMessage,
  useSetIsInfoPopupActive,
  useSetInfoBtnCb,
  useSetInfoBtnText,
  useSetToastMessage,
  useSetToastPopupStatus,
} from 'middlewares/reduxToolkits/commonSlice';
import { getAPI, postAPI } from './apis';
import {
  TypeGetAPIHookParams,
  TypeJavascriptInterface,
  TypeKeyValueForm,
  TypeNormalConfirmPopupHook,
  TypePostAPIByConfirmPopupHook,
  TypePostAPIHookParams,
} from './types';
import {
  handleParseDataFromJSInterface,
  handleSetParamsWithSync,
} from './utils';
import {
  AfterErrorPopupThenStopLogic,
  BeforeErrorPopupThenNonStopLogic,
  BeforeErrorPopupThenStopLogic,
  ToastError,
} from './customErrorClasses';

/**
 * [input, textarea, select tag 커스텀 훅]
 *
 * @param {TypeKeyValueForm} keyValueForm key - value 객체
 * @returns
 */
export function useChangeHook(keyValueForm: TypeKeyValueForm) {
  const [form, setForm] = useState<TypeKeyValueForm>(keyValueForm);

  const useChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      const { name, value } = e.currentTarget;

      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setForm],
  );

  return { form, setForm, useChange };
}

/**
 * 엔터 눌렀을 때 특정 콜백이 동작하도록 하는 동작할 함수
 * @param {any} value 변하는 key - value 객체
 * @param {function} cb 엔터 눌렀을 때 콜백
 * @returns
 */
export function useEnterKeyDownHook(value: any, cb: () => any) {
  const useEnterKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
        e.currentTarget.blur();
        cb();
      }
    },
    [value],
  );

  return useEnterKeyDown;
}

/**
 * [catch 절 처리 커스텀 훅]
 *
 * @returns
 */
export function useSetCatchClauseForErrorPopupHook() {
  const dispatch = useDispatch();

  const useSetCatchClauseForErrorPopup = useCallback(
    (error: any, errorPopupBtnCb?: (code?: string) => any) => {
      console.error(error);

      if (error instanceof BeforeErrorPopupThenStopLogic)
        throw new BeforeErrorPopupThenStopLogic(error.message);

      if (error instanceof BeforeErrorPopupThenNonStopLogic) return;

      dispatch(useSetErrorMessage({ errorMessage: error.message }));
      dispatch(useSetIsErrorPopupActive({ isErrorPopupActive: true }));
      dispatch(
        useSetErrorBtnCb({
          useErrorBtnCb: () => {
            dispatch(useSetIsErrorPopupActive({ isErrorPopupActive: false }));
            dispatch(useSetErrorMessage({ errorMessage: '' }));
            dispatch(useSetErrorBtnCb({}));
            errorPopupBtnCb?.(error.code);
          },
        }),
      );

      if (error instanceof AfterErrorPopupThenStopLogic)
        throw new AfterErrorPopupThenStopLogic(error.message);
    },
    [],
  );

  return useSetCatchClauseForErrorPopup;
}

/**
 * [Info 팝업 훅]
 *
 * @returns
 */
export function useSetInfoPopupHook() {
  const dispatch = useDispatch();

  const useSetInfoPopup = useCallback(
    (message: string, infoPopupBtnCb?: () => any) => {
      dispatch(useSetInfoMessage({ infoMessage: message }));
      dispatch(useSetIsInfoPopupActive({ isInfoPopupActive: true }));
      dispatch(
        useSetInfoBtnCb({
          useInfoBtnCb: () => {
            dispatch(useSetIsInfoPopupActive({ isInfoPopupActive: false }));
            dispatch(useSetInfoMessage({ infoMessage: '' }));
            dispatch(useSetInfoBtnText({ infoBtnText: '' }));
            dispatch(useSetInfoBtnCb({}));
            infoPopupBtnCb?.();
          },
        }),
      );
    },
    [],
  );

  return useSetInfoPopup;
}

/**
 * [Toast 팝업 훅]
 *
 * @returns
 */
export function useSetToastPopupHook() {
  const dispatch = useDispatch();
  const [ids, setIds] = useState({
    fstId: -1,
    scnId: -1,
  });

  const useSetToastPopup = useCallback(
    (message: string) => {
      // 기존 timeout id clear
      clearTimeout(ids.fstId);
      clearTimeout(ids.scnId);

      // 토스트 메세지 설정 및 timeout id 설정
      dispatch(useSetToastMessage({ toastMessage: message }));
      dispatch(useSetToastPopupStatus({ toastPopupStatus: 'fadeIn' }));
      const fstId: any = setTimeout(() => {
        dispatch(useSetToastPopupStatus({ toastPopupStatus: 'fadeOut' }));
      }, 2000);
      const scnId: any = setTimeout(() => {
        dispatch(useSetToastMessage({ toastMessage: '' }));
        dispatch(useSetToastPopupStatus({ toastPopupStatus: '' }));
      }, 2500);

      setIds((prevState) => ({
        ...prevState,
        fstId,
        scnId,
      }));
    },
    [ids],
  );

  return useSetToastPopup;
}

/**
 * [get method 커스텀 훅]
 *
 * @param {TypeGetAPIHookParams} params
 * url, API 성공시 바로 실행하는 콜백, API 실패시 바로 실행하는 콜백, 에러팝업 버튼 콜백을 담고 있는 객체
 *
 * @returns
 */
export function useGetDataHook({
  url,
  beforeCb,
  successCb,
  failCb,
  errorPopupBtnCb,
}: TypeGetAPIHookParams) {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();
  const useSetToastPopup = useSetToastPopupHook();
  const [data, setData] = useState<any>(null);
  let isSuccess = false;
  let response: any;

  useEffect(() => {
    (async () => {
      if (!url) return;

      try {
        await beforeCb?.();
        dispatch(useSetIsLoading({ isLoading: true }));
        response = await getAPI(url, failCb);
        isSuccess = true;
      } catch (error: any) {
        isSuccess = false;
        if (error instanceof ToastError) useSetToastPopup(error.message);
        else useSetCatchClauseForErrorPopup(error, errorPopupBtnCb);
      } finally {
        if (isSuccess) {
          setData(response);
          await successCb?.(response);
        }
        dispatch(useSetIsLoading({ isLoading: false }));
      }
    })();
  }, []);

  const useGetData = useCallback(async () => {
    if (!url) return;
    let isSuccess = false;
    let response: any;

    try {
      beforeCb?.();
      dispatch(useSetIsLoading({ isLoading: true }));
      response = await getAPI(url, failCb);
      isSuccess = true;
    } catch (error: any) {
      isSuccess = false;
      if (error instanceof ToastError) useSetToastPopup(error.message);
      else useSetCatchClauseForErrorPopup(error, errorPopupBtnCb);
    } finally {
      if (isSuccess) {
        setData(response);
        dispatch(useSetIsLoading({ isLoading: false }));
        await successCb?.(response);
      } else {
        dispatch(useSetIsLoading({ isLoading: false }));
      }
    }
  }, [data]);

  return { data, useGetData };
}

/**
 * [post method 커스텀 훅]
 *
 * @param {TypeGetAPIHookParams} params
 * url, body 데이터, API 성공시 바로 실행하는 콜백,
 * API 실패시 바로 실행하는 콜백, 에러팝업 버튼 콜백을 담고 있는 객체
 *
 * @returns
 */
export function usePostDataHook({
  url,
  beforeCb,
  successCb,
  failCb,
  errorPopupBtnCb,
}: TypePostAPIHookParams) {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();
  const useSetToastPopup = useSetToastPopupHook();
  const [data, setData] = useState<any>(null);
  let isSuccess = false;
  let response: any;

  const usePostData = useCallback(
    async (params?: any) => {
      if (!url) return;

      try {
        await beforeCb?.();
        dispatch(useSetIsLoading({ isLoading: true }));
        response = await postAPI(
          url,
          await handleSetParamsWithSync(params),
          failCb,
        );
        isSuccess = true;
      } catch (error: any) {
        isSuccess = false;
        if (error instanceof ToastError) useSetToastPopup(error.message);
        else useSetCatchClauseForErrorPopup(error, errorPopupBtnCb);
      } finally {
        if (isSuccess) {
          setData(response);
          dispatch(useSetIsLoading({ isLoading: false }));
          await successCb?.(response);
        } else {
          dispatch(useSetIsLoading({ isLoading: false }));
        }
      }
    },
    [url, beforeCb, successCb, failCb, errorPopupBtnCb, data],
  );

  return { data, usePostData };
}

/**
 * [post method 확인 팝업 커스텀 훅]
 * @returns
 */
export function usePostDataByConfirmPopupHook({
  message,
  url,
  confirmBtnText,
  cancelBtnText,
  beforeCb,
  successCb,
  cancelBtnCb,
  failCb,
  errorPopupBtnCb,
}: TypePostAPIByConfirmPopupHook) {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();
  const useSetToastPopup = useSetToastPopupHook();
  const [data, setData] = useState<any>();
  let isSuccess = false;
  let response: any;

  const useSetActivePostDataByConfirmPopup = useCallback(
    (params?: any) => {
      dispatch(useSetMessage({ message }));
      dispatch(useSetIsConfirmPopupActive({ isConfirmPopupActive: true }));
      dispatch(useSetConfirmBtnText({ confirmBtnText }));
      dispatch(useSetCancelBtnText({ cancelBtnText }));

      dispatch(
        useSetConfirmBtnCb({
          useConfirmBtnCb: async () => {
            try {
              await beforeCb?.();
              dispatch(useSetIsLoading({ isLoading: true }));
              response = await postAPI(
                url,
                await handleSetParamsWithSync(params),
                failCb,
              );
              isSuccess = true;
              dispatch(
                useSetIsConfirmPopupActive({ isConfirmPopupActive: false }),
              );
              dispatch(useSetConfirmBtnText({ confirmBtnText: '' }));
              dispatch(useSetCancelBtnText({ cancelBtnText: '' }));
              dispatch(useSetConfirmBtnCb({}));
              dispatch(useSetCancelBtnCb({}));
            } catch (error: any) {
              isSuccess = false;
              if (error instanceof ToastError) useSetToastPopup(error.message);
              else useSetCatchClauseForErrorPopup(error, errorPopupBtnCb);
            } finally {
              if (isSuccess) {
                setData(response);
                dispatch(useSetIsLoading({ isLoading: false }));
                await successCb?.(response);
              } else {
                dispatch(useSetIsLoading({ isLoading: false }));
              }
            }
          },
        }),
      );

      dispatch(
        useSetCancelBtnCb({
          useCancelBtnCb: () => {
            cancelBtnCb?.();
            dispatch(
              useSetIsConfirmPopupActive({ isConfirmPopupActive: false }),
            );
            dispatch(useSetMessage({ message: '' }));
            dispatch(useSetConfirmBtnText({ confirmBtnText: '' }));
            dispatch(useSetCancelBtnText({ cancelBtnText: '' }));
            dispatch(useSetConfirmBtnCb({}));
            dispatch(useSetCancelBtnCb({}));
          },
        }),
      );
    },
    [
      message,
      url,
      confirmBtnText,
      cancelBtnText,
      successCb,
      cancelBtnCb,
      failCb,
      errorPopupBtnCb,
      data,
    ],
  );

  return { data, useSetActivePostDataByConfirmPopup };
}

/**
 * [일반 확인 팝업 커스텀 훅]
 *
 * @returns
 */
export function useNormalConfirmPopupHook({
  message,
  confirmBtnText,
  cancelBtnText,
  confirmCb,
  cancelBtnCb,
}: TypeNormalConfirmPopupHook) {
  const dispatch = useDispatch();

  const useNormalConfirmPopup = useCallback(() => {
    dispatch(useSetMessage({ message }));
    dispatch(useSetConfirmBtnText({ confirmBtnText }));
    dispatch(useSetCancelBtnText({ cancelBtnText }));
    dispatch(useSetIsConfirmPopupActive({ isConfirmPopupActive: true }));

    dispatch(
      useSetConfirmBtnCb({
        useConfirmBtnCb: () => {
          confirmCb?.();
          dispatch(useSetIsConfirmPopupActive({ isConfirmPopupActive: false }));
          dispatch(useSetMessage({ message: '' }));
          dispatch(useSetConfirmBtnText({ confirmBtnText: '' }));
          dispatch(useSetCancelBtnText({ cancelBtnText: '' }));
          dispatch(useSetConfirmBtnCb({}));
          dispatch(useSetCancelBtnCb({}));
        },
      }),
    );

    dispatch(
      useSetCancelBtnCb({
        useCancelBtnCb: () => {
          cancelBtnCb?.();
          dispatch(useSetIsConfirmPopupActive({ isConfirmPopupActive: false }));
          dispatch(useSetMessage({ message: '' }));
          dispatch(useSetConfirmBtnText({ confirmBtnText: '' }));
          dispatch(useSetCancelBtnText({ cancelBtnText: '' }));
          dispatch(useSetConfirmBtnCb({}));
          dispatch(useSetCancelBtnCb({}));
        },
      }),
    );
  }, [message, confirmBtnText, cancelBtnText, confirmCb, cancelBtnCb]);

  return useNormalConfirmPopup;
}

/**
 * [Javascript Interface 에러팝업 처리용 Hook]
 */
export function useJavascriptInterfaceHook() {
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();

  const useJavascriptInterface = useCallback(
    async ({
      bridge,
      action,
      data,
      hasCb,
      isActiveErrorPopup,
    }: TypeJavascriptInterface) => {
      try {
        return await handleParseDataFromJSInterface({
          bridge,
          action,
          data,
          hasCb,
          isActiveErrorPopup,
        });
      } catch (error: any) {
        return useSetCatchClauseForErrorPopup(error);
      }
    },
    [],
  );

  return useJavascriptInterface;
}
