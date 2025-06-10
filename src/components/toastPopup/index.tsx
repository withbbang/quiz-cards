import React from 'react';
import { PropState } from 'middlewares/configureReducer';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import { connect } from 'react-redux';
import { Action } from 'redux';
import styles from './ToastPopup.module.scss';

function mapStateToProps(state: PropState): CommonState {
  return {
    ...state.common,
  };
}

function mapDispatchToProps(dispatch: (actionFunction: Action<any>) => any) {
  return {};
}

function ToastPopup({
  toastPopupStatus,
  toastMessage,
}: CommonState): React.JSX.Element {
  return (
    <div
      className={`${styles.toast_pop} ${
        toastPopupStatus ? styles[toastPopupStatus] : ''
      }`}
      style={toastPopupStatus ? { display: '' } : { display: 'none' }}
    >
      <p
        className={styles.toast_txt}
        dangerouslySetInnerHTML={{ __html: toastMessage || '' }}
      />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ToastPopup);
