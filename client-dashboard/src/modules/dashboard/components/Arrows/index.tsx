import React from 'react';
import styled from 'styled-components';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

const ArrowCircle = styled.div`
  background: rgb(183, 140, 105);
  height: 30px;
  width: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg {
    color: #fff;
  }
  :before {
    display: none;
  }
`;

const ArrowRectangular = styled.div`
  background: #f7f7f7;
  width: 30px;
  height: 140px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg {
    color: #000;
  }
  :before {
    display: none;
  }
`;

export const NextArrowCircle = props => {
  const { className, onClick } = props;
  return (
    <ArrowCircle onClick={onClick} className={className}>
      <RightOutlined />
    </ArrowCircle>
  );
};

export const PrevArrowCircle = props => {
  const { className, onClick } = props;
  return (
    <ArrowCircle onClick={onClick} className={className}>
      <LeftOutlined />
    </ArrowCircle>
  );
};

export const NextArrowRectangular = props => {
  const { className, onClick } = props;
  return (
    <ArrowRectangular
      onClick={onClick}
      className={`${className} custom`}
      style={{ top: '41%' }}
    >
      <RightOutlined />
    </ArrowRectangular>
  );
};

export const PrevArrowRectangular = props => {
  const { className, onClick } = props;
  return (
    <ArrowRectangular
      onClick={onClick}
      className={`${className} custom`}
      style={{ top: '41%' }}
    >
      <LeftOutlined />
    </ArrowRectangular>
  );
};
