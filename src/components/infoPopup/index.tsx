import React from 'react';
import { PropState } from 'middlewares/configureReducer';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import { connect } from 'react-redux';
import { Action } from 'redux';
import styles from './InfoPopup.module.scss';

function mapStateToProps(state: PropState): CommonState {
  return {
    ...state.common,
  };
}

function mapDispatchToProps(dispatch: (actionFunction: Action<any>) => any) {
  return {};
}

function InfoPopup({
  isInfoPopupActive,
  infoMessage,
  infoBtnText,
  useInfoBtnCb,
}: CommonState): React.JSX.Element {
  return (
    <div
      className={styles.background}
      style={
        isInfoPopupActive !== undefined && isInfoPopupActive
          ? { display: '' }
          : { display: 'none' }
      }
    >
      <div className={styles.modalBody}>
        <span dangerouslySetInnerHTML={{ __html: infoMessage || '' }} />
        <div>
          <button onClick={useInfoBtnCb}>{infoBtnText || '확인'}</button>
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPopup);
