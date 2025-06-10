import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  doc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db, handleConvertTimestamp } from 'modules/utils';
import { useSetUid } from 'middlewares/reduxToolkits/authSlice';
import {
  useSetCancelBtnCb,
  useSetConfirmBtnCb,
  useSetIsConfirmPopupActive,
  useSetIsLoading,
  useSetMessage,
} from 'middlewares/reduxToolkits/commonSlice';
import { useSetCatchClauseForErrorPopupHook } from './customHooks';

/**
 * [회원가입]
 */
export function useSignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();
  let isSuccess = false;

  const useSignUpHook = useCallback(async (email: string, password: string) => {
    try {
      dispatch(useSetIsLoading({ isLoading: true }));
      await createUserWithEmailAndPassword(auth, email, password);
      isSuccess = true;
    } catch (error: any) {
      useSetCatchClauseForErrorPopup(error);
    } finally {
      dispatch(useSetIsLoading({ isLoading: false }));
      if (isSuccess) navigate('/sign-in');
    }
  }, []);

  return useSignUpHook;
}

/**
 * [로그인]
 */
export function useSignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();
  let isSuccess = false;
  let result: any;

  const useSignInHook = useCallback(async (email: string, password: string) => {
    try {
      dispatch(useSetIsLoading({ isLoading: true }));
      result = await signInWithEmailAndPassword(auth, email, password);
      isSuccess = true;
    } catch (error: any) {
      useSetCatchClauseForErrorPopup(error);
    } finally {
      dispatch(useSetIsLoading({ isLoading: false }));
      if (isSuccess) {
        dispatch(useSetUid({ uid: result.user.uid }));
        navigate('/', { replace: true });
      }
    }
  }, []);

  return useSignInHook;
}

/**
 * [로그아웃]
 */
export function useSignOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();
  let isSuccess = false;

  const useSignOutHook = useCallback(async () => {
    try {
      dispatch(useSetIsLoading({ isLoading: true }));
      await signOut(auth);
      isSuccess = true;
    } catch (error: any) {
      useSetCatchClauseForErrorPopup(error);
    } finally {
      dispatch(useSetIsLoading({ isLoading: false }));
      if (isSuccess) {
        dispatch(useSetUid({ uid: '' }));
        navigate('/', { replace: true });
      }
    }
  }, []);

  return useSignOutHook;
}

/**
 * [인가 확인]
 *
 * @param {Function} successCb 성공 콜백
 */
export function useCheckAuthStateChanged(successCb?: () => any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();
  let isSuccess = false;

  useEffect(() => {
    dispatch(useSetIsLoading({ isLoading: true }));
    onAuthStateChanged(auth, (user) => {
      try {
        if (user) {
          isSuccess = true;
          dispatch(useSetUid({ uid: user.uid }));
        } else throw Error('Failed to check auth');
      } catch (error: any) {
        dispatch(useSetUid({ uid: '' }));
        useSetCatchClauseForErrorPopup(error, () =>
          navigate('/', { replace: true }),
        );
      } finally {
        dispatch(useSetIsLoading({ isLoading: false }));
        if (isSuccess) successCb?.();
      }
    });
  }, []);
}

/**
 * [데이터들 조회]
 *
 * @param {string} type 타입
 * @param {Function | undefined} successCb 성공 콜백
 */
export function useGetDatas(type: string, successCb?: (response?: any) => any) {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();
  const [datas, setDatas] = useState<any[]>([]);

  const useGetDatasHook = useCallback(async () => {
    try {
      dispatch(useSetIsLoading({ isLoading: true }));

      const datas = await getDocs(
        query(collection(db, type), orderBy('createDt', 'desc')),
      );

      const response = datas.docs.map((doc) => {
        const { title, createDt, updateDt } = doc.data();

        return {
          id: doc.id,
          title,
          createDt: handleConvertTimestamp(createDt.toDate(), 'yyyy-MM-dd'),
          updateDt,
        };
      });

      setDatas(response);
      successCb?.(response);
    } catch (error: any) {
      useSetCatchClauseForErrorPopup(error);
    } finally {
      dispatch(useSetIsLoading({ isLoading: false }));
    }
  }, [type, datas]);

  return { datas, useGetDatasHook };
}

/**
 * [단일 데이터 조회]
 *
 * @param {Function | undefined} successCb 성공 콜백
 * @returns data
 */
export function useGetData(successCb?: (response?: any) => any) {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();
  const [data, setData] = useState<any>(null);

  const useGetDataHook = useCallback(
    async (type: string, id: string) => {
      try {
        dispatch(useSetIsLoading({ isLoading: true }));

        const response = await getDoc(doc(db, type, id));

        if (response !== undefined && response.exists()) {
          setData(response.data());
          successCb?.(response.data());
        } else throw Error('Failed to get data');
      } catch (error: any) {
        useSetCatchClauseForErrorPopup(error);
      } finally {
        dispatch(useSetIsLoading({ isLoading: false }));
      }
    },
    [data],
  );

  return { data, useGetDataHook };
}

/**
 * [데이터 추가]
 *
 * @param {Function | undefined} successCb 성공 콜백
 * @returns
 */
export function useAddData(successCb?: Function) {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();

  const useAddDataHook = useCallback(async (params: any) => {
    try {
      dispatch(useSetIsLoading({ isLoading: true }));
      await addDoc(collection(db, params.type), params);
      successCb?.();
    } catch (error: any) {
      useSetCatchClauseForErrorPopup(error);
    } finally {
      dispatch(useSetIsLoading({ isLoading: false }));
    }
  }, []);

  return useAddDataHook;
}

/**
 * [데이터 수정]
 *
 * @param {Function | undefined} successCb 성공 콜백
 * @returns
 */
export function useUpdateData(successCb?: Function) {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();

  const useUpdateDataHook = useCallback(async (params: any) => {
    try {
      dispatch(useSetIsLoading({ isLoading: true }));
      await updateDoc(doc(db, params.type, params.id), params);
      successCb?.();
    } catch (error: any) {
      useSetCatchClauseForErrorPopup(error);
    } finally {
      dispatch(useSetIsLoading({ isLoading: false }));
    }
  }, []);

  return useUpdateDataHook;
}

/**
 * [데이터 삭제]
 *
 * @param {Function | undefined} successCb 성공 콜백
 * @returns
 */
export const useDeleteData = (successCb?: Function) => {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();

  const useDeleteDataHook = useCallback(async (type: string, id: string) => {
    try {
      dispatch(useSetIsLoading({ isLoading: true }));
      await deleteDoc(doc(db, type, id));
      successCb?.();
    } catch (error: any) {
      useSetCatchClauseForErrorPopup(error);
    } finally {
      dispatch(useSetIsLoading({ isLoading: false }));
    }
  }, []);

  return useDeleteDataHook;
};

/**
 * [데이터 추가 팝업 훅]
 *
 * @param confirmBtnCb 성공 콜백
 * @returns
 */
export const useAddPopup = (confirmBtnCb: (params?: any) => any) => {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();

  const useAddPopupHook = useCallback(
    async (type: string, params?: any) => {
      dispatch(useSetMessage({ message: 'Are you sure you wanna add?' }));
      dispatch(useSetIsConfirmPopupActive({ isConfirmPopupActive: true }));

      dispatch(
        useSetConfirmBtnCb({
          useConfirmBtnCb: async () => {
            try {
              dispatch(useSetIsLoading({ isLoading: true }));
              await addDoc(collection(db, type), params);
              dispatch(
                useSetIsConfirmPopupActive({ isConfirmPopupActive: false }),
              );
              dispatch(useSetConfirmBtnCb({}));
              dispatch(useSetCancelBtnCb({}));
              confirmBtnCb?.();
            } catch (error: any) {
              useSetCatchClauseForErrorPopup(error);
            } finally {
              dispatch(useSetIsLoading({ isLoading: false }));
            }
          },
        }),
      );

      dispatch(
        useSetCancelBtnCb({
          useCancelBtnCb: () => {
            dispatch(
              useSetIsConfirmPopupActive({ isConfirmPopupActive: false }),
            );
            dispatch(useSetMessage({ message: '' }));
            dispatch(useSetConfirmBtnCb({}));
            dispatch(useSetCancelBtnCb({}));
          },
        }),
      );
    },
    [confirmBtnCb],
  );

  return useAddPopupHook;
};

/**
 * [데이터 갱신 팝업 훅]
 *
 * @param confirmBtnCb 성공 콜백
 * @returns
 */
export const useUpdatePopup = (confirmBtnCb: (params?: any) => any) => {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();

  const useUpdatePopupHook = useCallback(
    async (type: string, id: string, params?: any) => {
      dispatch(useSetMessage({ message: 'Are you sure you wanna update?' }));
      dispatch(useSetIsConfirmPopupActive({ isConfirmPopupActive: true }));

      dispatch(
        useSetConfirmBtnCb({
          useConfirmBtnCb: async () => {
            try {
              dispatch(useSetIsLoading({ isLoading: true }));
              await updateDoc(doc(db, type, id), params);
              dispatch(
                useSetIsConfirmPopupActive({ isConfirmPopupActive: false }),
              );
              dispatch(useSetConfirmBtnCb({}));
              dispatch(useSetCancelBtnCb({}));
              confirmBtnCb?.();
            } catch (error: any) {
              useSetCatchClauseForErrorPopup(error);
            } finally {
              dispatch(useSetIsLoading({ isLoading: false }));
            }
          },
        }),
      );

      dispatch(
        useSetCancelBtnCb({
          useCancelBtnCb: () => {
            dispatch(
              useSetIsConfirmPopupActive({ isConfirmPopupActive: false }),
            );
            dispatch(useSetMessage({ message: '' }));
            dispatch(useSetConfirmBtnCb({}));
            dispatch(useSetCancelBtnCb({}));
          },
        }),
      );
    },
    [confirmBtnCb],
  );

  return useUpdatePopupHook;
};

/**
 * [데이터 삭제 팝업 훅]
 *
 * @param confirmBtnCb 성공 콜백
 * @returns
 */
export const useDeletePopup = (confirmBtnCb: (params?: any) => any) => {
  const dispatch = useDispatch();
  const useSetCatchClauseForErrorPopup = useSetCatchClauseForErrorPopupHook();

  const useDeletePopupHook = useCallback(
    async (type: string, id: string) => {
      dispatch(useSetMessage({ message: 'Are you sure you wanna delete?' }));
      dispatch(useSetIsConfirmPopupActive({ isConfirmPopupActive: true }));

      dispatch(
        useSetConfirmBtnCb({
          useConfirmBtnCb: async () => {
            try {
              dispatch(useSetIsLoading({ isLoading: true }));
              await deleteDoc(doc(db, type, id));
              dispatch(
                useSetIsConfirmPopupActive({ isConfirmPopupActive: false }),
              );
              dispatch(useSetConfirmBtnCb({}));
              dispatch(useSetCancelBtnCb({}));
              confirmBtnCb?.();
            } catch (error: any) {
              useSetCatchClauseForErrorPopup(error);
            } finally {
              dispatch(useSetIsLoading({ isLoading: false }));
            }
          },
        }),
      );

      dispatch(
        useSetCancelBtnCb({
          useCancelBtnCb: () => {
            dispatch(
              useSetIsConfirmPopupActive({ isConfirmPopupActive: false }),
            );
            dispatch(useSetMessage({ message: '' }));
            dispatch(useSetConfirmBtnCb({}));
            dispatch(useSetCancelBtnCb({}));
          },
        }),
      );
    },
    [confirmBtnCb],
  );

  return useDeletePopupHook;
};

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
