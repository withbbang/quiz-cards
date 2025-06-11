/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import styles from './Index.module.scss';

function IndexPT({
  uid,
  onSignOut,
  onMovePage,
}: IndexPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <div className={styles.signBtns}>
        {uid !== undefined && uid !== null && uid !== '' ? (
          <button onClick={onSignOut}>Sign Out</button>
        ) : (
          <>
            <button onClick={() => onMovePage('/sign-in')}>Sign In</button>
            {/* <button onClick={() => onMovePage('/sign-up')}>Sign Up</button> */}
          </>
        )}
      </div>
      <h1>Quiz Cards</h1>
      <div className={styles.buttons}>
        <div>
          <button onClick={() => onMovePage('/정보처리기사')}>
            정보처리기사
          </button>
        </div>
      </div>
    </div>
  );
}

interface IndexPTProps {
  uid?: string;
  onSignOut: () => Promise<void>;
  onMovePage: (path: string) => void;
}

export default IndexPT;
