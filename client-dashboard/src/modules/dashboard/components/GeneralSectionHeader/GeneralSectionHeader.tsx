import {FC, ReactNode} from 'react';
import {GeneralSectionHeaderWrapper} from './style';
import {ReactI18NextChild} from 'react-i18next';
import {ArrowLeft} from '@/icons';
import {useNavigate} from 'react-router-dom';
import {Button} from 'antd';

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

  return (
    <GeneralSectionHeaderWrapper className={'GeneralSectionHeader'}>
      <div className={'GeneralSectionHeader__main-section'}>
        <div className={'GeneralSectionHeader__main-section__title'}>
          {showArrowIcon && (
            <Button
              icon={<ArrowLeft />}
              type={'text'}
              className={'header-section-icon'}
              onClick={() => {
                navigate(-1);
              }}
            />
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
