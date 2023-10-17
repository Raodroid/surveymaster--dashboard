import { FC } from 'react';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { useTranslation } from 'react-i18next';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';

const Block: FC<QuestionBlockProps> = props => {
  const { t } = useTranslation();
  const { fieldName } = props;
  return (
    <>
      <ControlledInput
        readOnly
        className={'w-[100px]'}
        label={t('common.type')}
        inputType={INPUT_TYPES.INPUT}
        name={`${fieldName}.type`}
      />

      <ControlledInput
        className={'w-[200px] hide-helper-text'}
        inputType={INPUT_TYPES.INPUT}
        name={`${fieldName}.blockDescription`}
        label={'Block:'}
      />
    </>
  );
};

export default Block;
