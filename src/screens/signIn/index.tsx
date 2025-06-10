import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropState } from 'middlewares/configureReducer';
import { Action } from '@reduxjs/toolkit';
import { SHA256 } from 'crypto-js';
import { AuthState } from 'middlewares/reduxToolkits/authSlice';
import {
  useChangeHook,
  useEnterKeyDownHook,
  useSetInfoPopupHook,
} from 'modules/customHooks';
import { useSignIn } from 'modules/firebaseHooks';
import Back from 'components/back';
import AuthInput from 'components/authInput';
import styles from './SignIn.module.scss';

function mapStateToProps(state: PropState): AuthState {
  return { ...state.auth };
}

function mapDispatchToProps(dispatch: (actionFunction: Action<any>) => any) {
  return {};
}

function SignIn({ uid }: TypeSignIn): React.JSX.Element {
  const navigate = useNavigate();
  const useSignInHook = useSignIn();
  const useSetInfoPopup = useSetInfoPopupHook();
  const { form, useChange } = useChangeHook({ email: '', password: '' });

  useEffect(() => {
    if (uid !== undefined && uid !== null && uid !== '')
      navigate('/', { replace: true });
  }, []);

  // 이메일, 비밀번호 입력 후 엔터 콜백
  const useEnterKeyDown = useEnterKeyDownHook(form, () => useLogin());

  // 로그인
  const useLogin = () => {
    if (!form.email) {
      useSetInfoPopup('No Empty Email');
      return;
    }

    if (!form.password) {
      useSetInfoPopup('No Empty Password');
      return;
    }

    useSignInHook(`${form.email}`, SHA256(`${form.password}`).toString());
  };

  return (
    <div className={styles.wrap}>
      <Back />
      <div className={styles.innerWrap}>
        <h2>Sign In</h2>
        <AuthInput
          title="Email"
          label="email"
          value={form.email as string}
          onChange={useChange}
          onKeyDown={useEnterKeyDown}
        />
        <AuthInput
          title="Password"
          label="password"
          value={form.password as string}
          onChange={useChange}
          onKeyDown={useEnterKeyDown}
        />
        {/* <div className={styles.btns}>
          <button onClick={() => navigate('/sign-up')}>Sign Up</button>
          <button onClick={() => useLogin()}>Sign In</button>
        </div> */}
        <div className={styles.btns} style={{ justifyContent: 'end' }}>
          <button onClick={() => useLogin()}>Sign In</button>
        </div>
      </div>
    </div>
  );
}

interface TypeSignIn extends AuthState {}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
