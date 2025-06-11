import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  handleCheckEmpty,
  useAddPopup,
  useDeletePopup,
  useGetData,
  useGetDatas,
  useSignOut,
  useUpdatePopup,
} from 'modules/firebaseHooks';
import { AuthState } from 'middlewares/reduxToolkits/authSlice';
import { useChangeHook, useInitPopupHook } from 'modules/customHooks';
import { history } from 'modules/utils';
import QuizCardsPT from './QuizCardsPT';

function QuizCardsCT({ uid }: QuizCardsCTProps): React.JSX.Element {
  const { license = '' } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const useSignOutHoot = useSignOut();
  const useInitPopup = useInitPopupHook();
  const useAddPopupHook = useAddPopup(() => handleSuccessCb());
  const useUpdatePopupHook = useUpdatePopup(() => handleSuccessCb());
  const useDeletePopupHook = useDeletePopup(() => handleSuccessCb());
  const { datas, useGetDatasHook } = useGetDatas(license);
  const { useGetDataHook } = useGetData((response) => {
    setForm((prevState) => ({
      ...prevState,
      ...response,
    }));
  });
  const { form, setForm, useChange } = useChangeHook({
    title: '',
    contents: '',
    enEn: '',
    enKo: '',
    selectedId: '',
    popupType: '',
    isActivePopup: false,
    xPos: -1,
    yPos: -1,
    isDisabledTts: false,
    isDisabledStt: false,
  });

  useEffect(() => {
    if (!(license === '정보처리기사'))
      navigate('/not-found', { replace: true });
    else {
      handleCheckEmpty(uid, useGetDatasHook);
    }

    return () => {
      useInitPopup();
    };
  }, []);

  useEffect(() => {
    const backEvent = history.listen(({ action }) => {
      if (action === 'POP') {
        handleCloseCard();
        useInitPopup();
      }
    });

    return backEvent;
  }, []);

  const handleMovePage = (path: string) => navigate(path);

  // api 호출 후 콜백
  const handleSuccessCb = () => {
    useGetDatasHook();
    handleCloseCard();
  };

  // 카드 클릭 콜백
  const handleClickCard = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
    popupType: string,
  ) => {
    e.stopPropagation();

    history.push(pathname);

    if (id !== '0') useGetDataHook(license, id);

    setForm((prevState) => ({
      ...prevState,
      selectedId: id,
      popupType,
      isActivePopup: true,
      xPos: e.clientX,
      yPos: e.clientY,
    }));
  };

  // 카드 닫기
  const handleCloseCard = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (form.isActivePopup) navigate(-1);
    setForm((prevState) => ({
      ...prevState,
      title: '',
      contents: '',
      enEn: '',
      enKo: '',
      selectedId: '',
      popupType: '',
      isActivePopup: false,
      xPos: e ? e.clientX : form.x,
      yPos: e ? e.clientY : form.y,
      isDisabledTts: false,
      isDisabledStt: false,
    }));
  };

  // 추가, 수정 버튼 콜백
  const handleAddUpdateOkBtn = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    let params: any;

    if (uid === undefined || uid === null || uid === '') {
      handleCloseCard(e);
      return;
    }

    if (license === '정보처리기사')
      params = {
        title: form.title,
        contents: form.contents,
      };
    else
      params = {
        title: form.title,
        enEn: form.enEn,
        enKo: form.enKo,
        contents: form.contents,
      };

    if (form.popupType === 'add') {
      params.createDt = new Date();
      useAddPopupHook(license, params);
    } else if (form.popupType === 'update') {
      params.updateDt = new Date();
      useUpdatePopupHook(license, `${form.selectedId}`, params);
    } else handleCloseCard(e);
  };

  // 삭제 버튼 콜백
  const handleClickDelete = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
  ) => {
    e.stopPropagation();

    useDeletePopupHook(license, id);
  };

  return (
    <QuizCardsPT
      uid={uid}
      title={license}
      datas={datas}
      onSignOut={useSignOutHoot}
      onMovePage={handleMovePage}
      onClickCard={handleClickCard}
      onClickUpdate={handleClickCard}
      onClickDelete={handleClickDelete}
    />
  );
}

interface QuizCardsCTProps extends AuthState {}

export default QuizCardsCT;
