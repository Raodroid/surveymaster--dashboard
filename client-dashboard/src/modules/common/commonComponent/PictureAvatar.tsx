import React, { FC } from 'react';
import styled from 'styled-components';

interface IPictureAvatarWrapper {
  size?: string;
}

const PictureAvatarWrapper = styled.img<IPictureAvatarWrapper>`
  --size: ${p => p.size};
  width: var(--size);
  height: var(--size);
  border-radius: 8px;
`;

const PictureAvatar: FC<{ avatarURL: string; size?: string }> = props => {
  const { avatarURL, size = '3.143rem' } = props;
  return <PictureAvatarWrapper size={size} src={avatarURL} alt={''} />;
};

export default PictureAvatar;
