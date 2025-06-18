import { FC } from 'react';
import Block from '@components/Block/Block';
import {
  BranchLogicType,
  Conjunction,
  EmptyString,
  SubSurveyFlowElement,
} from '@/type';
import { EmbeddedTypeIcon, QuestionTypeIcon } from '@/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { blockColor } from '../QuestionBranchIcon/QuestionBranchIcon';
import { useField } from 'formik';
import { ExtraSubBranchLogicDto } from '@pages/Survey';

const defaultLogicBranch: EmptyString<ExtraSubBranchLogicDto> = {
  blockSort_qId: '',
  row_column_BranchChoiceType: '',
  sort: Math.random(),
  conjunction: Conjunction.AND,
  logicType: BranchLogicType.QUESTION,
  questionVersionId: '',
  blockSort: 0,
  choiceType: '',
  optionSort: '',
  leftOperand: '',
  operator: '',
  rightOperand: '',
  row: '',
  column: '',
  questionType: '',
};

const EmptyCondition: FC<{ fieldName: string }> = props => {
  const { fieldName } = props;
  const [{ value: listEmbeddedData }, , { setValue }] =
    useField<ExtraSubBranchLogicDto[]>(fieldName);
  const { t } = useTranslation();
  return (
    <div
      className={
        'w-full h-full flex justify-center items-center overflow-scroll'
      }
    >
      <div className={'w-[600px] flex flex-col gap-6'}>
        <Block
          iconColor={blockColor[SubSurveyFlowElement.BLOCK]}
          title={t('common.addQuestionCondition')}
          desc={t('direction.addQuestionCondition')}
          icon={<QuestionTypeIcon className={'text-white'} />}
          action={
            <Button
              type={'primary'}
              className={'info-btn'}
              onClick={() => {
                setValue([defaultLogicBranch] as ExtraSubBranchLogicDto[]);
              }}
            >
              {t('common.addQuestionCondition')}
            </Button>
          }
        />
        <Block
          iconColor={blockColor[SubSurveyFlowElement.EMBEDDED_DATA]}
          title={t('common.addEmbeddedCondition')}
          desc={t('direction.addEmbeddedCondition')}
          icon={<EmbeddedTypeIcon className={'text-white'} />}
          action={
            <Button
              type={'primary'}
              className={'info-btn'}
              onClick={() => {
                setValue([
                  {
                    ...defaultLogicBranch,
                    logicType: BranchLogicType.EMBEDDED_FIELD,
                  },
                ] as ExtraSubBranchLogicDto[]);
              }}
            >
              {t('common.addEmbeddedCondition')}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default EmptyCondition;
