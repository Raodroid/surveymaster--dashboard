import {
  BaseQuestionVersionDto,
  DateFormat,
  QuestionType,
  TimeFormat,
} from '../../../../../../type';
import { transformQuestionData } from '../util';

const defaultInput: BaseQuestionVersionDto = {
  type: QuestionType.MULTIPLE_CHOICE,
  title: '',
  options: [
    {
      sort: 1,
      text: '1',
      imageUrl: '/',
    },
    {
      sort: 2,
      text: '2',
      imageUrl: '/',
    },
  ],
  numberMax: 2,
  numberMin: 1,
  numberStep: 2,
  dataMatrix: {
    rows: [],
    columns: [],
  },
  image: '',
  dateFormat: DateFormat.DD_MM_YYYY,
  timeFormat: TimeFormat.TWELVE_HOUR,
};

describe('transformQuestionData', () => {
  it('type =  MULTIPLE_CHOICE', () => {
    expect(transformQuestionData(defaultInput)).toEqual({
      options: [
        { sort: 1, text: '1' },
        { sort: 2, text: '2' },
      ],
      title: '',
      type: 'MULTIPLE_CHOICE',
    });
  });
  it('type = PHOTO', () => {
    const input = {
      ...defaultInput,
      type: QuestionType.PHOTO,
    };
    expect(transformQuestionData(input)).toEqual({
      options: [
        { imageUrl: '/', sort: 1, text: '1' },
        { imageUrl: '/', sort: 2, text: '2' },
      ],
      title: '',
      type: 'PHOTO',
    });
  });
  it('type = RADIO_BUTTONS', () => {
    const input = { ...defaultInput, type: QuestionType.RADIO_BUTTONS };
    expect(transformQuestionData(input)).toEqual({
      options: [
        { sort: 1, text: '1' },
        { sort: 2, text: '2' },
      ],
      title: '',
      type: 'RADIO_BUTTONS',
    });
  });
  it('type = FORM_FIELD', () => {
    const input = { ...defaultInput, type: QuestionType.FORM_FIELD };
    expect(transformQuestionData(input)).toEqual({
      options: [
        { sort: 1, text: '1' },
        { sort: 2, text: '2' },
      ],
      title: '',
      type: 'FORM_FIELD',
    });
  });
  it('type = SLIDER', () => {
    const input = {
      ...defaultInput,
      type: QuestionType.SLIDER,
    };
    expect(transformQuestionData(input)).toEqual({
      numberMax: 2,
      numberMin: 1,
      numberStep: 2,
      title: '',
      type: 'SLIDER',
    });
  });
  it('type = TIME_PICKER', () => {
    const input = { ...defaultInput, type: QuestionType.FORM_FIELD };
    expect(transformQuestionData(input)).toEqual({
      options: [
        { sort: 1, text: '1' },
        { sort: 2, text: '2' },
      ],
      title: '',
      type: 'FORM_FIELD',
    });
  });
  it('type = DATE_PICKER', () => {
    const input = { ...defaultInput, type: QuestionType.DATE_PICKER };
    expect(transformQuestionData(input)).toEqual({
      dateFormat: 'DD_MM_YYYY',
      title: '',
      type: 'DATE_PICKER',
    });
  });
  it('type = DATA_MATRIX', () => {
    const input = { ...defaultInput, type: QuestionType.DATA_MATRIX };
    expect(transformQuestionData(input)).toEqual({
      dataMatrix: { columns: [], rows: [] },
      title: '',
      type: 'DATA_MATRIX',
    });
  });
  it('type = TEXT_GRAPHIC', () => {
    const input = { ...defaultInput, type: QuestionType.TEXT_GRAPHIC };
    expect(transformQuestionData(input)).toEqual({
      image: '',
      title: '',
      type: 'TEXT_GRAPHIC',
    });
  });
});
