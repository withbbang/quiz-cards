/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Back from 'components/back';
import Card from 'components/card';
import styles from './QuizCards.module.scss';

function QuizCardsPT({
  uid,
  title,
  datas,
  onSignOut,
  onMovePage,
  onClickCard,
  onClickUpdate,
  onClickDelete,
}: QuizCardsPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <Back />
      <div className={styles.signBtns}>
        {/* <span>
          <SVG type="search" width="30px" height="30px" />
        </span> */}
        {uid !== undefined && uid !== null && uid !== '' ? (
          <button onClick={onSignOut}>Sign Out</button>
        ) : (
          <>
            <button onClick={() => onMovePage('/sign-in')}>Sign In</button>
            {/* <button onClick={() => navigate('/sign-up')}>Sign Up</button> */}
          </>
        )}
      </div>
      <h2>{title}</h2>
      <div className={styles.innerWrap}>
        <Card id="0" title="" onClickCard={onClickCard} />
        {Array.isArray(datas) &&
          datas.length > 0 &&
          datas.map(({ id, title, createDt }: any) => (
            <Card
              key={id}
              id={id}
              title={title}
              createDt={createDt}
              type={title}
              onClickCard={onClickCard}
              onClickUpdate={onClickUpdate}
              onClickDelete={onClickDelete}
            />
          ))}
      </div>
    </div>
  );
}

interface QuizCardsPTProps {
  uid?: string;
  title: string;
  datas: any[];
  onSignOut: () => Promise<void>;
  onMovePage: (path: string) => void;
  onClickCard: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
    popupType: string,
  ) => void;
  onClickUpdate: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
    popupType: string,
  ) => void;
  onClickDelete: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
  ) => void;
}

export default QuizCardsPT;
