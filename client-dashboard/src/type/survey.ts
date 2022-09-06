export enum QuestionType {
  RANK = 'RANK',
  YES_NO = 'YES_NO',
  MULTIPLE_CHOICES = 'MULTIPLE_CHOICES',
  NUMBER = 'NUMBER',
  TEXT_INPUT = 'TEXT_INPUT',
  TEXT_AREA = 'TEXT_AREA',
  INTRODUCE = 'INTRODUCE',
  RATING = 'RATING',
  MONTH_YEAR_PICKER = 'MONTH_YEAR_PICKER',
}

export enum QuestionUnit {
  AMOUNT = 'AMOUNT',
  CENTIMETER = 'CENTIMETER',
  KILOGRAM = 'KILOGRAM',
  SLICE = 'SLICE',
  GRAM = 'GRAM',
  PIECE = 'PIECE',
  ITEM = 'ITEM',
  BOWL = 'BOWL',
  DISH = 'DISH',
  METER = 'METER',
}

export const translateQuestionUnit = {
  [QuestionUnit.AMOUNT]: 'Amount',
  [QuestionUnit.CENTIMETER]: 'cm',
  [QuestionUnit.KILOGRAM]: 'kg',
  [QuestionUnit.SLICE]: 'slice',
  [QuestionUnit.GRAM]: 'g',
  [QuestionUnit.PIECE]: 'piece',
  [QuestionUnit.ITEM]: 'item',
  [QuestionUnit.BOWL]: 'bowl',
  [QuestionUnit.DISH]: 'dish',
  [QuestionUnit.METER]: 'm',
};

export enum InternalSurveyStatus {
  DRAFT = 'DRATF',
  COMPLETED = 'COMPLETED',
}

export enum CompareType {
  EQUAL = 'EQUAL', // surveyValues[keyPath] === valueToCompare;
  NOT_EQUAL = 'NOT_EQUAL', // surveyValues[keyPath] !== valueToCompare;
  GREATER_THAN = 'GREATER_THAN', // surveyValues[keyPath] > valueToCompare;
  GREATER_THAN_EQUAL = 'GREATER_THAN_EQUAL', // surveyValues[keyPath] > valueToCompare;
  LOWER_THAN = 'LOWER_THAN', // surveyValues[keyPath] < valueToCompare;
  LOWER_THAN_EQUAL = 'LOWER_THAN_EQUAL', // surveyValues[keyPath] <= valueToCompare;
  IS_EMPTY_VALUE_UNDEFINE_NULL = 'EMPTY_VALUE_UNDEFINE_NULL', // (!surveyValues[keyPath])
  IS_NOT_EMPTY_VALUE_UNDEFINE_NULL = 'IS_NOT_EMPTY_VALUE_UNDEFINE_NULL', // (!!surveyValues[keyPath])
  CONTAINS = 'CONTAINS',
}

export interface IInternalSurvey {
  id: string;
  name: string;
  displayName?: string;
  welcomeText?: string;
  description: string;
  durationInMinutes?: number;
  sections?: IInternalSurveySections[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
export interface IInternalSurveySections {
  id: string;
  internalSurveyId: string;
  sort: number;
  title?: string;
  description?: string;
  image?: string;
  sectionQuestions?: ISectionQuestion[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isIntroductionSection?: boolean;
}

export interface ISurveySectionCondition {
  keyPath: string;
  compareType: CompareType;
  valueToCompare?: string | number | boolean | null | undefined;
}

export interface ISectionQuestion {
  id: string;
  internalSurveySectionId: string;
  internalSurveyQuestionId: string;
  keyPath?: string; // keyPath of question in this section question eg: `gender`, `eatingHabit` if this field is null, key_path should get from default_key_path in internal_question
  sort: number;
  image?: string;
  isQuestionCondition?: boolean;
  condition?: ISurveySectionCondition[];
  question?: ISurveyQuestion;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  relatedQuestions?: ISectionQuestion[];
}

export interface ISurveyQuestion {
  isMaskQuestion?: boolean;
  id: string;
  title?: string;
  description?: string;
  defaultKeyPath: string;
  type: QuestionType;
  options?: ISurveyOption[];
  isRequired: boolean;
  isSingleChoice?: boolean;
  unit?: QuestionUnit;
  unit_icon?: string;
  amount?: number; // unit: gam && amount = 200 -> 200g
  rankFrom?: number;
  rankTo?: number;
  rankStep?: number;
  numberFrom?: number;
  numberTo?: number;
  textMinLength?: number;
  textMaxLength?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  hint?: string;
  showTitleAsHTML?: boolean;
}

export interface ISurveyOption {
  id: string;
  internal_question_id: string;
  label: string;
  value: string | number;
  sort: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isNoneOption?: boolean;
}

type SurveyFieldValue = string | string[] | number | number[] | boolean;

export interface ISurveyResult {
  id?: string;
  profileId?: string;
  internalSurveyId: string;
  surveyData: Record<string, SurveyFieldValue>;
  status: InternalSurveyStatus;
  currentSurveySectionSort: number;
  startAt: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  internalSurvey?: IInternalSurvey;
}

export const newSupportQuestionTypeMock: IInternalSurvey = {
  id: '1',
  name: 'New Question Type',
  durationInMinutes: 5,
  description:
    'Tell us how you are doing! So that we can offer better recommendations to reach your heath goals',
  createdAt: new Date(),
  updatedAt: new Date(),
  sections: [
    {
      // Multiple Choice - Answer Type: Single Choice, if isSingleChoice = false then this question become Answer Type: Multiple Choices
      id: '1',
      title: "Hello here's section without question",
      description: '',
      internalSurveyId: '1',
      isIntroductionSection: true,
      sort: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: '',
      description: '',
      internalSurveyId: '1',
      sort: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectionQuestions: [
        {
          id: '1',
          sort: 1,
          internalSurveyQuestionId: '1',
          internalSurveySectionId: '2',
          question: {
            id: '1',
            title: 'What is your age?',
            defaultKeyPath: 'yourAge',
            type: QuestionType.MONTH_YEAR_PICKER, // HERE
            isRequired: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: '3',
      title: '',
      description: '',
      internalSurveyId: '1',
      sort: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectionQuestions: [
        {
          id: '1',
          sort: 1,
          internalSurveyQuestionId: '1',
          internalSurveySectionId: '2',
          question: {
            id: '1',
            title:
              "<span>I hereby consent to AMILI's BIO & ME <a target='_blank' href='https://bioandme.asia/pages/terms-of-service'>Terms of Service</a>, <a target='_blank' href='https://bioandme.asia/pages/privacy-policy'>Privacy Policy</a> and <a target='_blank' href='https://bioandme.asia/pages/informed-consent'>Informed Consent</a>.</span>",
            defaultKeyPath: 'yourAge',
            showTitleAsHTML: true, // HERE
            type: QuestionType.MONTH_YEAR_PICKER,
            isRequired: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: '4',
      title: '',
      description: '',
      internalSurveyId: '1',
      sort: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectionQuestions: [
        {
          id: '1',
          sort: 1,
          internalSurveyQuestionId: '1',
          internalSurveySectionId: '2',
          question: {
            id: '1',
            title: 'Do you have any of the following allergens?',
            defaultKeyPath: 'allergents',
            type: QuestionType.MULTIPLE_CHOICES,
            isSingleChoice: false,
            options: [
              {
                id: '1',
                internal_question_id: '1',
                label: 'No allergens',
                value: 'None',
                isNoneOption: true, // HERE
                sort: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: '2',
                internal_question_id: '1',
                label: 'Egg',
                value: 'egg',
                sort: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: '3',
                internal_question_id: '1',
                label: 'Fish',
                value: 'Fish',
                sort: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: '4',
                internal_question_id: '1',
                label: 'Soy',
                value: 'Soy',
                sort: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            isRequired: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ],
};

export enum SurveyNames {
  HEALTH_SURVEY = 'Health Survey',
  DIET_SURVEY = 'Diet Survey',
  ON_BOARDING = 'Onboarding Survey',
  HEALTH_COACHING = 'Health Coaching Survey',
  PROBIOTICS = 'Probiotics Survey',
  TEST_KIT = 'Test Kit Survey',
  PLATFORM = 'Platform Survey',
  V1_SURVEY = 'V1 Customer Survey',
  V1_LIFESTYLE_SURVEY = 'Lifestyle Survey',
  RETURN_CUSTOMER_SURVEY = 'Return Customer Survey',
}
