import React, { FC, ReactNode, useCallback } from 'react';
import { GeneralSectionHeaderWrapper } from './style';
import { ReactI18NextChild } from 'react-i18next';
import { ArrowLeft } from '@/icons';
import { useNavigate } from 'react-router-dom';

interface IGeneralSectionHeader {
  showArrowIcon?: boolean;
  title: string;
  endingComponent?:
    | string
    | ReactI18NextChild
    | Iterable<ReactI18NextChild>
    | ReactNode;
}
const GeneralSectionHeader: FC<IGeneralSectionHeader> = props => {
  const { title, endingComponent, showArrowIcon = true } = props;
  const navigate = useNavigate();
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <GeneralSectionHeaderWrapper className={'GeneralSectionHeader'}>
      <div className={'GeneralSectionHeader__main-section'}>
        <div className={'GeneralSectionHeader__main-section__title'}>
          {showArrowIcon && (
            <span className={'header-section-icon'} onClick={goBack}>
              <ArrowLeft />
            </span>
          )}
          <span className={'header-section-title'}>{title}</span>
        </div>
      </div>
      {endingComponent && (
        <div className={'GeneralSectionHeader__ending-section'}>
          {endingComponent}
        </div>
      )}
    </GeneralSectionHeaderWrapper>
  );
};

export default GeneralSectionHeader;
