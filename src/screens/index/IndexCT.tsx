import React, { useEffect } from 'react';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import { CustomWindow } from 'modules/types';
import {
  usePostDataByConfirmPopupHook,
  usePostDataHook,
} from 'modules/customHooks';
import { handleParseDataFromJSInterface } from 'modules/utils';
import { ToastError } from 'modules/customErrorClasses';
import IndexPT from './IndexPT';

function IndexCT({}: IndexCTProps): React.JSX.Element {
  const { useSetActivePostDataByConfirmPopup } = usePostDataByConfirmPopupHook({
    message: 'hello',
    url: '/wlekfj',
    confirmBtnText: 'There',
    cancelBtnText: 'Hello',
    beforeCb: () => console.warn('called beforeCb'),
    successCb: () => console.warn('called successCb'),
    cancelBtnCb: () => console.warn('called cancelBtnCb'),
    failCb: (code?: string, message?: string) => {
      throw new ToastError('toast err');
    },
    errorPopupBtnCb: (code?: string) => console.warn('called errorPopupBtnCb'),
  });

  const { usePostData } = usePostDataHook({
    url: '/welkjtl',
  });

  const test = (p: string): Promise<string> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(p);
      }, 500);
    });

  const onClick = () => {
    useSetActivePostDataByConfirmPopup({
      a: 'a',
      b: test('b'),
      c: test('c'),
    });
  };

  const handleGoBack = (data?: any) => {
    console.warn('goBack visit? ', data);
  };

  const handleOnResult = (data?: any) => {
    console.warn('onResult visit?', data);
  };

  useEffect(() => {
    const customWindow = window as CustomWindow;
    customWindow.goBack = handleGoBack;
    customWindow.onResult = handleOnResult;

    usePostData({
      c: 'c',
      d: handleParseDataFromJSInterface({
        bridge: '',
        action: '',
      }),
    });

    return () => {
      delete customWindow.goBack;
      delete customWindow.onResult;
    };
  }, []);

  return <IndexPT onClick={onClick} />;
}

interface IndexCTProps extends CommonState {}

export default IndexCT;
