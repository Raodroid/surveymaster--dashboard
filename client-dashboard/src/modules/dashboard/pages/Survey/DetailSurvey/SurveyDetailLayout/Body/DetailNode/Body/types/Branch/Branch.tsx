import React, { FC, Fragment, memo, useMemo } from 'react';
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
import { Button, Divider, Empty, Tooltip } from 'antd';
import { objectKeys, transformEnumToOption } from '@/utils';
import EmbeddedBlockChoice from './EmbeddedBlockChoice/EmbeddedBlockChoice';
import QuestionChoice, {
  IQuestionChoice,
} from './QuestionChoice/QuestionChoice';
import { QuestionBlockProps } from '../type';
import {
  ExtraSubBranchLogicDto,
  IEditSurveyFormValues,
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
  const { values } = useFormikContext<IEditSurveyFormValues>();
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
            {!branchLogics || branchLogics.length === 0 ? (
              <Empty />
            ) : (
              <div className={'min-w-[770px]'}>
                {(branchLogics || []).map((list, index) => {
                  const { logicType } = list;

                  const LogicComponent = componentMap[logicType];
                  return (
                    <Fragment key={index}>
                      <div className={'font-semibold text-[16px] mb-3'}>
                        {t('common.condition')} No{index + 1}:
                      </div>
                      <div className={'flex gap-3'} key={index}>
                        {index === 0 ? (
                          <UncontrolledInput
                            className={`w-[70px] view-mode`}
                            inputType={INPUT_TYPES.INPUT}
                            value={'If'}
                          />
                        ) : (
                          <ControlledInput
                            className={`w-[70px] ${
                              isViewMode ? 'view-mode' : ''
                            }`}
                            inputType={INPUT_TYPES.SELECT}
                            name={`${fieldName}[${index}].conjunction`}
                            options={objectKeys(Conjunction).map(key => ({
                              value: Conjunction[key],
                              label: Conjunction[key],
                            }))}
                          />
                        )}
                        <ControlledInput
                          className={`w-[150px] ${
                            isViewMode ? 'view-mode' : ''
                          }`}
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
                          <Tooltip
                            title={t('direction.removeConditionRow')}
                            placement={'bottom'}
                          >
                            <Button
                              size={'small'}
                              className={'px-2'}
                              type={'text'}
                              onClick={() => remove(index)}
                              icon={<TrashOutlined />}
                            />
                          </Tooltip>
                        )}
                      </div>
                      <Divider className={'mt-0'} />
                    </Fragment>
                  );
                })}
              </div>
            )}
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
