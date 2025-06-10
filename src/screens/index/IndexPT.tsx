/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import styles from './Index.module.scss';

function IndexPT({ onClick }: IndexPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <h1 onClick={onClick}>Index Page</h1>
    </div>
  );
}

interface IndexPTProps {
  onClick: () => void;
}

export default IndexPT;
