import React from 'react';
import { PropState } from 'middlewares/configureReducer';
import { AuthState } from 'middlewares/reduxToolkits/authSlice';
import { connect } from 'react-redux';
import { Action } from 'redux';
import SVG from 'modules/SVG';
import styles from './Card.module.scss';

function mapStateToProps(state: PropState): AuthState {
  return {
    ...state.auth
  };
}

function mapDispatchToProps(dispatch: (actionFunction: Action<any>) => any) {
  return {};
}

function Card({
  uid,
  id,
  title,
  createDt,
  type = '',
  onClickCard,
  onClickUpdate,
  onClickDelete
}: typeCard): React.JSX.Element {
  return (
    <div
      className={styles.wrap}
      onClick={(e) => onClickCard(e, id, id === '0' ? 'add' : 'view')}
    >
      {type && (
        <div className={styles.floatCategory}>
          <span>
            <SVG type="category" width="20px" height="20px" />
            &nbsp;
            {type}
          </span>
        </div>
      )}
      {uid !== undefined && uid !== null && uid !== '' && id !== '0' ? (
        <div className={styles.floatBtns}>
          <span
            onClick={(e) => onClickUpdate && onClickUpdate(e, id, 'update')}
          >
            <SVG type="modify" width="20px" height="20px" />
          </span>
          <span onClick={(e) => onClickDelete && onClickDelete(e, id)}>
            <SVG type="trash" width="20px" height="20px" />
          </span>
        </div>
      ) : (
        ''
      )}
      <h3>{title}</h3>
      <div className={styles.cardInfo}>
        <span>
          {createDt && (
            <>
              <SVG type="time" width="20px" height="20px" />
              &nbsp;{createDt}
            </>
          )}
        </span>
      </div>
      {id === '0' && (
        <span className={styles.add}>
          <SVG type="add" width="100px" height="100px" />
        </span>
      )}
    </div>
  );
}

interface typeCard extends AuthState {
  id: string;
  title: string;
  createDt?: string;
  type?: string;
  onClickCard: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
    popupType: string
  ) => void;
  onClickUpdate?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
    popupType: string
  ) => void;
  onClickDelete?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);
