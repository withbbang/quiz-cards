import React from 'react';
import { PropState } from 'middlewares/configureReducer';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import { connect } from 'react-redux';
import { Action } from 'redux';
import styles from './ErrorPopup.module.scss';

function mapStateToProps(state: PropState): CommonState {
  return {
    ...state.common,
  };
}

function mapDispatchToProps(dispatch: (actionFunction: Action<any>) => any) {
  return {};
}

function ErrorPopup({
  isErrorPopupActive,
  errorMessage,
  useErrorBtnCb,
}: CommonState): React.JSX.Element {
  return (
    <div
      className={styles.background}
      style={
        isErrorPopupActive !== undefined && isErrorPopupActive
          ? { display: '' }
          : { display: 'none' }
      }
    >
      <div className={styles.modalBody}>
        <span dangerouslySetInnerHTML={{ __html: errorMessage || '' }} />
        <div>
          <button onClick={useErrorBtnCb}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPopup);
