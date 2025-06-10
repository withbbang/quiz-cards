import React from 'react';
import { useNavigate } from 'react-router-dom';
import SVG from 'modules/SVG';
import styles from './Back.module.scss';

function Back(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div className={styles.backBtn}>
      <span onClick={() => navigate(-1)}>
        <SVG type="back" width="30px" height="30px" />
      </span>
    </div>
  );
}

export default Back;
