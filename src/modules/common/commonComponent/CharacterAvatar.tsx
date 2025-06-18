import templateVariable from 'app/template-variables.module.scss';
import {FC} from 'react';
import styled from 'styled-components/macro';

interface ICharacterAvatar {
  firstName?: string;
  lastName?: string;
  size?: string;
}
const CharacterAvatar: FC<ICharacterAvatar> = props => {
  const { firstName, size = '3.143rem', lastName } = props;

  const renderText = () => {
    if (firstName && lastName) {
      return `${firstName?.substring(0, 1)}${lastName?.substring(0, 1)}`;
    } else {
      return `${(firstName || lastName)?.substring(0, 1)}`;
    }
  };

  return (
    <CharacterAvatarWrapper size={size}>{renderText()}</CharacterAvatarWrapper>
  );
};

export default CharacterAvatar;

interface ICharacterAvatarWrapper {
  size: string;
}

const CharacterAvatarWrapper = styled.div<ICharacterAvatarWrapper>`
  --size: ${p => p.size};
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1.429rem;
  background: ${templateVariable.secondary_color};
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  line-height: var(--size);
  text-align: center;
  font-size: calc(var(--size) / 2.4);
`;
