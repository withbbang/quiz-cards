import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { PropState } from 'middlewares/configureReducer';
import {
  useEnterKeyDownHook,
  useChangeHook,
  useSetInfoPopupHook,
} from 'modules/customHooks';
import AuthInput from 'components/authInput';
import { SHA256 } from 'crypto-js';
import { AuthState } from 'middlewares/reduxToolkits/authSlice';
import { useSignUp } from 'modules/firebaseHooks';
import Back from 'components/back';
import { handleCheckEmail } from 'modules/utils';
import styles from './SignUp.module.scss';

function mapStateToProps(state: PropState): AuthState {
  return { ...state.auth };
}

function mapDispatchToProps(dispatch: (actionFunction: Action<any>) => any) {
  return {};
}

function SignUp({ uid }: TypeSignUp): React.JSX.Element {
  const navigate = useNavigate();
  const useSignUpHook = useSignUp();
  const useSetInfoPopup = useSetInfoPopupHook();
  const { form, useChange } = useChangeHook({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (uid !== undefined && uid !== null && uid !== '')
      navigate('/', { replace: true });
  }, []);

  // 이메일, 비밀번호 입력 후 엔터 콜백
  const useEnterKeyDown = useEnterKeyDownHook(form, () => useJoin());

  // 가입
  const useJoin = () => {
    if (!form.email) {
      useSetInfoPopup('No Empty Email');
      return;
    }

    if (!handleCheckEmail(`${form.email}`)) {
      useSetInfoPopup('Check Email');
      return;
    }

    if (!form.password) {
      useSetInfoPopup('No Empty Password');
      return;
    }

    useSignUpHook(`${form.email}`, SHA256(`${form.password}`).toString());
  };

  return (
    <div className={styles.wrap}>
      <Back />
      <div className={styles.innerWrap}>
        <h2>Sign Up</h2>
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
        <div className={styles.btns}>
          <button onClick={useJoin}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

interface TypeSignUp extends AuthState {}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
