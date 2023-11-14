import React, { FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ControlledInput, UncontrolledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { FieldArray, useField, useFormikContext } from 'formik';
import {
  BranchLogicType,
  Conjunction,
  EmptyString,
  IOptionGroupItem,
} from '@/type';
import { Button } from 'antd';
import { objectKeys, transformEnumToOption } from '@/utils';
import EmbeddedBlockChoice from './EmbeddedBlockChoice/EmbeddedBlockChoice';
import QuestionChoice, {
  IQuestionChoice,
} from './QuestionChoice/QuestionChoice';
import { QuestionBlockProps } from '../type';
import {
  ExtraSubBranchLogicDto,
  IAddSurveyFormValues,
} from '@pages/Survey/SurveyForm/type';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { PlusOutLinedIcon, TrashOutlined } from '@/icons';
import { getQuestionFromAllBlocks } from './QuestionChoice/util';
import { SimpleBarCustom } from '@/customize-components';

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

const componentMap: Record<BranchLogicType, FC<IQuestionChoice>> = {
  [BranchLogicType.EMBEDDED_FIELD]: EmbeddedBlockChoice,
  [BranchLogicType.QUESTION]: QuestionChoice,
};

const Branch: FC<QuestionBlockProps> = props => {
  const { t } = useTranslation();
  const { fieldName: parentFieldName } = props;
  const { values } = useFormikContext<IAddSurveyFormValues>();
  const { isViewMode } = useCheckSurveyFormMode();
  const fieldName = `${parentFieldName}.branchLogics`;
  const [{ value: branchLogics }] =
    useField<ExtraSubBranchLogicDto[]>(fieldName);

  const options = useMemo<IOptionGroupItem[]>(() => {
    const result = [];
    getQuestionFromAllBlocks(values.version?.surveyFlowElements, result);
    return result;
  }, [values.version?.surveyFlowElements]);

  return (
    <FieldArray
      name={fieldName}
      render={({ push, remove }) => (
        <>
          <SimpleBarCustom>
            <div className={'min-w-[770px]'}>
              {(branchLogics || []).map((list, index) => {
                const { logicType } = list;

                const LogicComponent = componentMap[logicType];
                return (
                  <div className={'flex gap-3'} key={index}>
                    {index === 0 ? (
                      <UncontrolledInput
                        className={`w-[70px] view-mode`}
                        inputType={INPUT_TYPES.INPUT}
                        value={'If'}
                      />
                    ) : (
                      <ControlledInput
                        className={`w-[70px] ${isViewMode ? 'view-mode' : ''}`}
                        inputType={INPUT_TYPES.SELECT}
                        name={`${fieldName}[${index}].conjunction`}
                        options={objectKeys(Conjunction).map(key => ({
                          value: Conjunction[key],
                          label: Conjunction[key],
                        }))}
                      />
                    )}
                    <ControlledInput
                      className={`w-[120px] ${isViewMode ? 'view-mode' : ''}`}
                      inputType={INPUT_TYPES.SELECT}
                      name={`${fieldName}[${index}].logicType`}
                      options={transformEnumToOption(BranchLogicType, i =>
                        t(`common.${i}`),
                      )}
                    />

                    <LogicComponent
                      fieldName={fieldName}
                      index={index}
                      options={options}
                    />

                    {!isViewMode && (
                      <Button
                        size={'small'}
                        className={'px-2'}
                        type={'text'}
                        onClick={() => remove(index)}
                        icon={<TrashOutlined />}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </SimpleBarCustom>
          <div>
            {!isViewMode && (
              <Button
                type={'primary'}
                icon={<PlusOutLinedIcon />}
                className={'info-btn w-full'}
                onClick={() => {
                  push(defaultLogicBranch);
                }}
              >
                {t('common.addCondition')}
              </Button>
            )}
          </div>
        </>
      )}
    />
  );
};

export default memo(Branch);
