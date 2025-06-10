import React from 'react';
import SVG from 'modules/SVG';
import styles from './AuthInput.module.scss';

function AuthInput({
  title,
  label,
  value,
  disabled,
  isSearch,
  onChange,
  onKeyDown,
  onSearch,
}: TypeAuthInput): React.JSX.Element {
  return (
    <div className={styles.inputDiv}>
      <span>{title}</span>
      <input
        name={label}
        type={label}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      {isSearch && (
        <div className={styles.search} onClick={onSearch}>
          <SVG type="search" width="15px" height="15px" />
        </div>
      )}
    </div>
  );
}

interface TypeAuthInput {
  title: string;
  label: string;
  value: string;
  disabled?: boolean;
  isSearch?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}

export default AuthInput;
