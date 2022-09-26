import { useEffect, useState } from 'react';

export const useDebounce = (valueInput: any, delayTime: number = 500) => {
  const [value, setValue] = useState(valueInput);

  useEffect(() => {
    const x = setTimeout(() => {
      setValue(valueInput);
    }, delayTime);

    return () => {
      clearTimeout(x);
    };
  }, [delayTime, valueInput]);

  return value;
};
