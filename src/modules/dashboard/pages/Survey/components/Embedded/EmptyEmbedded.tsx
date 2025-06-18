import { FC } from 'react';
import Block from '@components/Block/Block';
import { SubEmbeddedDataDto, SubSurveyFlowElement } from '@/type';
import { EmbeddedTypeIcon } from '@/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { blockColor } from '../QuestionBranchIcon/QuestionBranchIcon';
import { useField } from 'formik';

const defaultListEmbeddedData: SubEmbeddedDataDto = {
  field: '',
  value: '',
};
const EmptyEmbedded: FC<{ fieldName: string }> = props => {
  const { fieldName } = props;
  const [{ value: listEmbeddedData }, , { setValue }] =
    useField<SubEmbeddedDataDto[]>(fieldName);
  const { t } = useTranslation();
  return (
    <div
      className={
        'w-full h-full flex justify-center items-center overflow-scroll'
      }
    >
      <div className={'w-[600px] flex flex-col gap-6'}>
        <Block
          iconColor={blockColor[SubSurveyFlowElement.EMBEDDED_DATA]}
          title={t('common.addEmbedded')}
          desc={''}
          icon={<EmbeddedTypeIcon className={'text-white'} />}
          action={
            <Button
              type={'primary'}
              className={'info-btn'}
              onClick={() => {
                setValue([defaultListEmbeddedData]);
              }}
            >
              {t('common.addEmbedded')}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default EmptyEmbedded;
