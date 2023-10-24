import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { FieldArray, useField } from 'formik';
import {
  BranchLogicType,
  Conjunction,
  EmptyString,
  SubBranchLogicDto,
} from '@/type';
import { Button } from 'antd';
import { objectKeys, transformEnumToOption } from '@/utils';
import EmbeddedBlockChoice from './EmbeddedBlockChoice/EmbeddedBlockChoice';
import QuestionChoice from './QuestionChoice/QuestionChoice';
import { QuestionBlockProps } from '../type';

const defaultLogicBranch: EmptyString<SubBranchLogicDto> = {
  sort: Math.random(),
  conjunction: Conjunction.AND,
  logicType: BranchLogicType.QUESTION,
  qId: '',
  blockSort: 0,
  choiceType: '',
  optionSort: '',
  leftOperand: '',
  operator: '',
  rightOperand: '',
};

const componentMap: Record<BranchLogicType, FC<any>> = {
  [BranchLogicType.EMBEDDED_FIELD]: EmbeddedBlockChoice,
  [BranchLogicType.QUESTION]: QuestionChoice,
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
            {(branchLogics || []).map((list, index) => {
              const { logicType } = list;

              const LogicComponent = componentMap[logicType];
              return (
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

                  <LogicComponent fieldName={fieldName} index={index} />

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
              );
            })}
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
