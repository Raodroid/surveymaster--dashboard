import styled from 'styled-components';
import { Button } from 'antd';
import templateVariable from '../../../app/template-variables.module.scss';

export const color = {
  primaryColor: templateVariable.primary_color,
  astronaut: '#292929',
  astronaut4Percent: 'rgba(35, 37, 103, 0.04)',
  astronaut8Percent: 'rgba(35, 37, 103, 0.08)',
  astronaut10Percent: templateVariable.border_color,
  astronaut20Percent: 'rgba(35, 37, 103, 0.2)',
  white20Percent: 'rgba(255, 255, 255, 0.2)',
  white: '#fff',
  success: templateVariable.success_color,
  skyBlue: '#007AE7',
  gray: 'rgba(35, 37, 103, 0.04)',
};

export const ButtonCommonStyle = styled(Button)`
  transition: 0.3s;
  position: relative;
  border-radius: 6px;
`;

export const ButtonBackgroundGreen = styled(ButtonCommonStyle)`
  background: ${color.success};
  color: ${color.white};
  border: none;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: transparent;
    border-radius: 6px;
    transition: 0.3s;
  }
  &:hover {
    background: ${color.success};
    color: ${color.white};
    &:after {
      background: ${color.astronaut8Percent} !important;
    }
  }

  &:focus,
  &:active {
    color: ${color.white};
    background: ${color.primaryColor};
    &:after {
      background: transparent;
    }
  }
`;

export const ButtonWhiteBorderPink = styled(ButtonCommonStyle)`
  background: ${color.white};
  color: ${color.primaryColor};
  border: 1px solid ${color.primaryColor};
  border-radius: 4px;
  &:hover,
  &:focus,
  &:active {
    background: ${color.primaryColor};
    color: ${color.white};
    border: 1px solid transparent;
  }
`;

export const ButtonBackgroundSkyBlue = styled(ButtonCommonStyle)`
  background: ${color.skyBlue};
  color: ${color.white};
  border: none;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: transparent;
    border-radius: 6px;
    transition: 0.3s;
  }
  &:hover {
    background: ${color.skyBlue};
    color: ${color.white};
    &:after {
      background: ${color.astronaut8Percent} !important;
    }
  }

  &:focus,
  &:active {
    color: ${color.white};
    background: ${color.skyBlue};
    &:after {
      background: transparent;
    }
  }
`;

export const ButtonBackgroundGray = styled(ButtonCommonStyle)`
  background: ${color.gray};
  color: ${color.astronaut};
  border: none;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: transparent;
    border-radius: 6px;
    transition: 0.3s;
  }
  &:hover {
    background: ${color.gray};
    color: ${color.astronaut};
    &:after {
      background: ${color.astronaut8Percent} !important;
    }
  }

  &:focus,
  &:active {
    color: ${color.astronaut};
    background: ${color.astronaut8Percent};
    &:after {
      background: transparent;
    }
  }
`;
