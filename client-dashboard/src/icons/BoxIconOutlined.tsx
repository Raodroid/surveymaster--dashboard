import React from 'react';

export const BoxIconOutlined = props => {
  const { style } = props;
  return (
    <svg
      style={style}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 12C2 6.486 6.465 2 11.953 2C17.493 2 22 6.486 22 12C22 17.514 17.514 22 12 22C6.486 22 2 17.514 2 12ZM4 12C4 16.411 7.589 20 12 20C16.411 20 20 16.411 20 12C20 7.589 16.391 4 11.953 4C7.567 4 4 7.589 4 12ZM13 7H11V14H13V7ZM13 17V15H11V17H13Z" />
    </svg>
  );
};
