import omit from 'lodash/omit';
import isNumber from 'lodash/isNumber';
import { BaseQuestionVersionDto, QuestionType } from '@/type';

export const transformQuestionData = (
  input: BaseQuestionVersionDto,
): BaseQuestionVersionDto => {
  let result = { ...input };

  switch (result.type) {
    case QuestionType.MULTIPLE_CHOICE:
    case QuestionType.RADIO_BUTTONS:
    case QuestionType.FORM_FIELD:
    case QuestionType.RANK_ORDER:
      result.options = input?.options?.map((opt, index) => ({
        id: opt?.id,
        sort: index + 1,
        text: opt.text,
        keyPath: opt?.keyPath,
      }));
      break;

    case QuestionType.PHOTO:
      result.options = input?.options?.map((opt, index) => ({
        id: opt?.id,
        sort: index + 1,
        text: opt.text,
        imageUrl: (opt as any)?.imageUrl.response?.url || opt.imageUrl,
      }));
      break;

    case QuestionType.SLIDER:
      result.numberMax = stringToInt(input.numberMax);
      result.numberMin = stringToInt(input.numberMin);
      result.numberStep = stringToInt(input.numberStep);
      break;

    case QuestionType.TEXT_NUMBER:
      result.numberMax = stringToNumber(input.numberMax);
      result.numberMin = stringToNumber(input.numberMin);
      result.maxDecimal = isNumber(stringToInt(input.maxDecimal))
        ? stringToInt(input.maxDecimal)
        : null;
      break;

    default:
      result = omit(result, [
        'options',
        'numberMax',
        'numberMin',
        'numberStep',
        'maxDecimal',
      ]);
      break;
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

const stringToInt = input => (isNumber(input) ? input : parseInt(input));

const stringToNumber = input =>
  isNumber(input) ? input : Number(parseFloat(input).toFixed(2));

export interface IAddQuestionFormValue extends BaseQuestionVersionDto {
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
}
