import React from 'react';

function Month(props: { month: string }) {
  const { month } = props;
  return <div>{month}</div>;
}

export default Month;
