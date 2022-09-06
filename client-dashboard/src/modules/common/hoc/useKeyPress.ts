import { useEffect, useState } from 'react';

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = key => {
      if (key.keyCode === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = key => {
      if (key.keyCode === targetKey) {
        setKeyPressed(false);
      }
    };
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};

export default useKeyPress;
