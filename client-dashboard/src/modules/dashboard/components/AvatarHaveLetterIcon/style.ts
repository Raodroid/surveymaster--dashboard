import styled from 'styled-components';
import templateVariable from '../../../../app/template-variables.module.scss';

interface IAvatarHaveLetterIconWrapper {
  image: string;
}
export const AvatarHaveLetterIconWrapper = styled.div<
  IAvatarHaveLetterIconWrapper
>`
  .image-wrapper {
    position: relative;
    background: url(${p => p.image});
    background-repeat: no-repeat;
    background-size: cover;
    height: 82px;
    width: 82px;
    border-radius: 50%;
    margin-right: 40px;
    .shortKey {
      position: absolute;
      top: -10px;
      left: -10px;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      background-color: ${templateVariable.primary_color};
      color: #f2eef3;
      font-family: Times;
      font-size: 14px;
      font-style: italic;
      font-weight: bold;
      text-align: center;
      line-height: 32px;
    }
  }
`;
