import React, { FC, memo, useMemo } from 'react';
import { BranchChoiceType, LogicOperator, QuestionType } from '@/type';
import { INPUT_TYPES } from '@input/type';
import { transformEnumToOption } from '@/utils';
import { ControlledInput } from '@/modules/common';
import { useTranslation } from 'react-i18next';
import { ExtraSubBranchLogicDto } from '@pages/Survey/SurveyForm/type';

const LogicOperatorInput: FC<{
  type: QuestionType;
  fieldName: string;
  fieldValue?: ExtraSubBranchLogicDto;
}> = props => {
  const { t } = useTranslation();

  const { type, fieldName, fieldValue } = props;

  const options = useMemo(() => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.RADIO_BUTTONS: {
        return [
          {
            value: LogicOperator.SELECTED,
            label: t(`common.${LogicOperator.SELECTED}`),
          },
          {
            value: LogicOperator.NOT_SELECTED,
            label: t(`common.${LogicOperator.NOT_SELECTED}`),
          },
        ];
      }
      case QuestionType.DATA_MATRIX: {
        if (
          fieldValue?.choiceType &&
          [
            BranchChoiceType.SELECTABLE_CHOICE,
            BranchChoiceType.SELECTABLE_ANSWER,
          ].includes(fieldValue.choiceType)
        ) {
          return [
            {
              value: LogicOperator.SELECTED,
              label: t(`common.${LogicOperator.SELECTED}`),
            },
            {
              value: LogicOperator.NOT_SELECTED,
              label: t(`common.${LogicOperator.NOT_SELECTED}`),
            },
          ];
        }
        return transformEnumToOption(LogicOperator, i => t(`common.${i}`));
      }
      case QuestionType.DATE_PICKER:
      case QuestionType.FORM_FIELD:
      case QuestionType.SIGNATURE:
      case QuestionType.PHOTO:
      case QuestionType.SLIDER:
      case QuestionType.TEXT_ENTRY:
      case QuestionType.TEXT_GRAPHIC:
      case QuestionType.TIME_PICKER:
      default: {
        return transformEnumToOption(LogicOperator, i => t(`common.${i}`));
      }
    }
  }, [type, t, fieldValue?.choiceType]);

  return (
    <ControlledInput
      className={'w-[150px]'}
      inputType={INPUT_TYPES.SELECT}
      name={`${fieldName}.operator`}
      options={options}
    />
  );
};
export default memo(LogicOperatorInput);
