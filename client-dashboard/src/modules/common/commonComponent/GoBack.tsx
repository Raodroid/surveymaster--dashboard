import React from 'react';
import { ArrowLeft } from 'icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import templateVariable from '../../../app/template-variables.module.scss';

interface IGoback {
  title: string;
  goBack?: Function;
}
export const GoBackWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 12px;
  height: 2.857rem;
  border-radius: 6px;
  transition: 0.3s;
  color: ${templateVariable.text_primary_color};
  &:hover {
    cursor: pointer;
    background: rgba(35, 37, 103, 0.04);
    & > span {
      color: ${templateVariable.text_primary_color};
    }
  }
  > svg {
    width: 16px;
    height: 13.67px;
    margin-right: 1.5rem;
  }
  > span {
    color: ${templateVariable.text_primary_color};
    font-size: ${templateVariable.font_size};
    font-weight: 600;
  }
`;

const GoBack: React.FC<IGoback> = props => {
  const { title, goBack } = props;
  const navigate = useNavigate();

  const handleBack = () => {
    if (goBack) goBack();
    else navigate(-1);
  };

  return (
    <GoBackWrapper onClick={handleBack}>
      <ArrowLeft />
      <span>{title}</span>
    </GoBackWrapper>
  );
};

export default GoBack;
