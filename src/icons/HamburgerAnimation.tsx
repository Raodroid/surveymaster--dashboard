import {FC, HTMLAttributes} from 'react';
import styled from 'styled-components/macro';
import templateVariable from '../app/template-variables.module.scss';

interface IHamburgerAnimation {
  open?: boolean;
}
export const HamburgerAnimation: FC<
  IHamburgerAnimation & HTMLAttributes<HTMLElement>
> = props => {
  const { open, className = '', ...rest } = props;

  return (
    <HamburgerAnimationWrapper
      {...rest}
      className={`hamburger-icon ${open ? 'open' : ''} ${className}`}
    >
      <span className={'hamburger-icon__line'} />
      <span className={'hamburger-icon__line'} />
      <span className={'hamburger-icon__line'} />
      <span className={'hamburger-icon__line'} />
    </HamburgerAnimationWrapper>
  );
};

const HamburgerAnimationWrapper = styled.div<HTMLAttributes<any>>`
  width: 28px;
  aspect-ratio: 1;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;
  background: none !important;

  .hamburger-icon__line {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: ${p =>
      p?.style?.background
        ? p?.style?.background
        : templateVariable.text_primary_color};
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.2s ease-in;
  }

  .hamburger-icon__line:nth-child(1) {
    top: 0;
  }

  .hamburger-icon__line:nth-child(2),
  .hamburger-icon__line:nth-child(3) {
    top: 30%;
  }

  .hamburger-icon__line:nth-child(4) {
    top: 60%;
  }

  &.open span:nth-child(1) {
    top: 30%;
    width: 0;
    left: 50%;
  }

  &.open .hamburger-icon__line:nth-child(2) {
    transform: rotate(45deg);
  }

  &.open .hamburger-icon__line:nth-child(3) {
    transform: rotate(-45deg);
  }

  &.open .hamburger-icon__line:nth-child(4) {
    top: 30%;
    width: 0;
    left: 50%;
  }
`;
