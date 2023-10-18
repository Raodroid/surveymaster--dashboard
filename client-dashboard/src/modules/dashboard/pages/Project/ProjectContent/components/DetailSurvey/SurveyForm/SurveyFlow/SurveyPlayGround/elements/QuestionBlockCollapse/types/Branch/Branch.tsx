import React, { FC, memo } from 'react';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { FieldArray, useField } from 'formik';
import {
  BranchLogicType,
  Conjunction,
  EmptyString,
  LogicOperator,
  SubBranchLogicDto,
} from '@/type';
import { Button } from 'antd';
import { objectKeys, transformEnumToOption } from '@/utils';
import { genQualtricsBlockId } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/utils';

const defaultLogicBranch: EmptyString<SubBranchLogicDto> = {
  blockId: genQualtricsBlockId(),
  sort: Math.random(),
  conjunction: Conjunction.AND,
  logicType: BranchLogicType.QUESTION,

  qId: '',
  choiceType: '',
  optionSort: '',
  leftOperand: '',
  operator: '',
  rightOperand: '',
};

const Branch: FC<QuestionBlockProps> = props => {
  const { t } = useTranslation();
  const { fieldName: parentFieldName } = props;

  const fieldName = `${parentFieldName}.branchLogics`;
  const [{ value: branchLogics }] = useField<SubBranchLogicDto[]>(fieldName);

  return (
    <div>
      <FieldArray
        name={fieldName}
        render={({ push, remove }) => (
          <div>
            {(branchLogics || []).map((list, index) => (
              <div className={'flex gap-3'} key={index}>
                {index !== 0 && (
                  <ControlledInput
                    className={'w-[100px]'}
                    inputType={INPUT_TYPES.SELECT}
                    name={`${fieldName}[${index}].conjunction`}
                    options={objectKeys(Conjunction).map(key => ({
                      value: Conjunction[key],
                      label: Conjunction[key],
                    }))}
                  />
                )}
                <ControlledInput
                  className={'w-[150px]'}
                  inputType={INPUT_TYPES.SELECT}
                  name={`${fieldName}[${index}].logicType`}
                  options={transformEnumToOption(BranchLogicType, i =>
                    t(`common.${i}`),
                  )}
                />
                <ControlledInput
                  placeholder={'LogicOperator'}
                  className={'w-[150px]'}
                  inputType={INPUT_TYPES.SELECT}
                  name={`${fieldName}[${index}].operator`}
                  options={transformEnumToOption(LogicOperator, i =>
                    t(`common.${i}`),
                  )}
                />
                <ControlledInput
                  className={'w-[100px]'}
                  inputType={INPUT_TYPES.INPUT}
                  name={`${fieldName}[${index}].value`}
                />
                <Button
                  size={'small'}
                  className={'px-2'}
                  danger
                  shape="circle"
                  onClick={() => remove(index)}
                >
                  -
                </Button>
              </div>
            ))}
            <div>
              <Button
                className={'w-full'}
                onClick={() => {
                  push(defaultLogicBranch);
                }}
              >
                {t('common.addCondition')}
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default memo(Branch);
