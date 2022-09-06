import React from 'react';
import { GoBackWrapper } from 'modules/common/styles';
import { ArrowLeft } from 'icons';
import { useNavigate } from 'react-router-dom';

interface IGoback {
  title: string;
  goBack?: Function;
}

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
