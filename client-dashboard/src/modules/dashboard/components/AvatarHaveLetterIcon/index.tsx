import React, { FC } from 'react';
import { AvatarHaveLetterIconWrapper } from './style';

interface IAvatarHaveLetterIcon {
  letter: string;
  image: string;
}
export const AvatarHaveLetterIcon: FC<IAvatarHaveLetterIcon> = props => {
  const { letter, image } = props;
  return (
    <AvatarHaveLetterIconWrapper image={image}>
      <div className={'image-wrapper'}>
        <span className={'shortKey'}>{letter.substring(0, 1)}</span>
      </div>
    </AvatarHaveLetterIconWrapper>
  );
};
