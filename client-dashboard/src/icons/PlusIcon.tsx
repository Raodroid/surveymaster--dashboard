import React from 'react';

export const PlusIcon = props => {
  const { style } = props;
  return (
    <svg
      style={style}
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14 6H8V0H6V6H0V8H6V14H8V8H14V6Z" />
    </svg>
  );
};
