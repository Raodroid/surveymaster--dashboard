import { BaseQuestionVersionDto, QuestionType } from '../../../../../type';

export const transformQuestionData = (
  input: BaseQuestionVersionDto,
): BaseQuestionVersionDto => {
  const result = { ...input };
  if (
    ![
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.RADIO_BUTTONS,
      QuestionType.FORM_FIELD,
      QuestionType.PHOTO,
    ].includes(result.type)
  ) {
    delete result?.options;
  } else {
    result.options = input?.options?.map((opt, index) => ({
      sort: index + 1,
      text: opt.text,
    }));
  }
  if (result.type === QuestionType.PHOTO) {
    result.options = input?.options?.map((opt, index) => ({
      sort: index + 1,
      text: opt.text,
      imageUrl: (opt as any)?.imageUrl.response?.url || opt.imageUrl,
    }));
  }

  if (result.type !== QuestionType.SLIDER) {
    delete result?.numberMax;
    delete result?.numberMin;
    delete result?.numberStep;
  } else {
    result.numberMax = stringToInt(input.numberMax);
    result.numberMin = stringToInt(input.numberMin);
    result.numberStep = stringToInt(input.numberStep);
  }
  if (result.type !== QuestionType.TIME_PICKER) {
    delete result.timeFormat;
  }
  if (result.type !== QuestionType.DATE_PICKER) {
    delete result.dateFormat;
  }
  if (result.type !== QuestionType.DATA_MATRIX) {
    delete result.dataMatrix;
    delete result.matrixType;
  }

  if (result.image) result.image = (result.image as any)?.response?.url || '';

  return result;
};

const stringToInt = input => {
  if (input && typeof input !== 'number') return parseInt(input);
  if (typeof input === 'number') return input;
};

export interface IAddQuestionFormValue extends BaseQuestionVersionDto {
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
}
