import * as Yup from 'yup';
import moment from 'moment';
import {
  BranchChoiceType,
  BranchLogicType,
  QuestionType,
  SubSurveyFlowElement,
} from '@/type';
import {
  ExtraSubBranchLogicDto,
  SurveyTemplateEnum,
} from '@/modules/dashboard/pages/Survey/SurveyForm/type';

export const INVALID_FIELDS = {
  MIN_USERNAME: 'validation.messages.minUserName',
  MAX_USERNAME: 'validation.messages.maxUserName',
  EMAIL_INVALID: 'validation.messages.emailInvalid',
  EMAIL_EXIST: 'validation.messages.emailExist',
  REQUIRED: 'validation.messages.required',
  MIN_PASSWORD: 'validation.messages.minPassword',
  MAX_PASSWORD: 'validation.messages.maxPassword',
  MIN_NAME: 'validation.messages.minName',
  MAX_NAME: 'validation.messages.maxName',
  PHONE_INVALID: 'validation.messages.phoneInvalid',
  SUBDOMAIN_INVALID: 'validation.messages.subdomainInvalid',
  SUBDOMAIN_NOT_MATCH: 'validation.messages.subdomainNotMatch',
  PASSWORD_NOT_MATCH: 'validation.messages.passwordNotMatch',
  NOT_INCLUDE_SPACE: 'validation.messages.notInclideSpace',
  SURVEY_INVALID: 'validation.messages.surveyInvalid',
  SURVEY_DUPLICATE: 'validation.messages.duplicateSurvey',
  ALLERGEN_DUPLICATE: 'validation.messages.duplicateAllergen',
  CATEGORY_DUPLICATE: 'validation.messages.duplicateCategory',
  PREFERENCE_DUPLICATE: 'validation.messages.duplicateDietPreference',
  INGREDIENT_DUPLICATE: 'validation.messages.duplicateIngredient',
  NUTRIENT_DUPLICATE: 'validation.messages.duplicateNutrient',
  CUISINE_DUPLICATE: 'validation.messages.duplicateCuisine',
  DIET_DUPLICATE: 'validation.messages.duplicateDiet',
  MIN_NUMBER: 'validation.messages.minNumber',
  MAX_NUMBER: 'validation.messages.maxNumber',
  MAX_DESCRIPTION: 'validation.messages.maxDescription',
  PASS_VALID: 'validation.messages.passValid',
  REQUIRE_TO_PASS: 'validation.messages.requireToPass',
  DAY_OF_BIRTH_CAN_NOT_BE_IN_THE_FUTURE:
    'validation.messages.theDateOfBirthCanNotBeInTheFutureTime',
  FEEDBACK_APPOINTMENT: 'validation.messages.feedbackAppointment',
  WEIGHT_MIN_NUMBER: 'validation.messages.weightMinNumber',
  HEIGHT_MIN_NUMBER: 'validation.messages.heightMinNumber',
  ONLY_SUPPORT_ALPHABET: 'validation.messages.onlySupportAlphabet',
};

export const phoneRegExp = /^[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,7}$/;
export const phonePrefix = /^[\\+]?[(]?[0-9]{1,3}$/;

export const URLRegExp =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export const passReg = /^(?=.*[0-9]).{6,20}$/;

export const alphabetRegex = /^[a-zA-Z0-9!@#\$%\^\&*\)\( +=._-]+$/g;

const yupString = Yup.string().matches(
  alphabetRegex,
  INVALID_FIELDS.ONLY_SUPPORT_ALPHABET,
);

export const userNameYup = Yup.string()
  .min(1, INVALID_FIELDS.MIN_USERNAME)
  .max(100, INVALID_FIELDS.MAX_USERNAME)
  .required(INVALID_FIELDS.REQUIRED);

export const emailYup = Yup.string()
  .email(INVALID_FIELDS.EMAIL_INVALID)
  .required(INVALID_FIELDS.REQUIRED);

export const regionYup = Yup.string().required(INVALID_FIELDS.REQUIRED);
export const countryYup = Yup.string().required(INVALID_FIELDS.REQUIRED);
export const streetYup = Yup.string().required(INVALID_FIELDS.REQUIRED);
export const unitNumberYup = Yup.string().required(INVALID_FIELDS.REQUIRED);
export const cityYup = Yup.string().required(INVALID_FIELDS.REQUIRED);
export const stateYup = Yup.string().required(INVALID_FIELDS.REQUIRED);
export const contactNameYup = yupString.required(INVALID_FIELDS.REQUIRED);
export const companyNameYup = Yup.string().required(INVALID_FIELDS.REQUIRED);

export const numberRequiredYup = Yup.number()
  .nullable()
  .required(INVALID_FIELDS.REQUIRED);

export const stringArrayRequiredYup = Yup.array().of(
  Yup.string().nullable().required(INVALID_FIELDS.REQUIRED),
);

export const passwordYup = Yup.string()
  .trim(INVALID_FIELDS.NOT_INCLUDE_SPACE)
  .strict(true)
  .matches(passReg, INVALID_FIELDS.PASS_VALID)
  .required(INVALID_FIELDS.REQUIRED);

export const verifyPasswordYup = Yup.string()
  .trim(INVALID_FIELDS.NOT_INCLUDE_SPACE)
  .strict(true)
  .matches(passReg, INVALID_FIELDS.PASS_VALID)
  .required(INVALID_FIELDS.REQUIRED)
  .oneOf([Yup.ref('password'), null], INVALID_FIELDS.PASSWORD_NOT_MATCH);

export const firstNameYup = yupString
  .min(2, INVALID_FIELDS.MIN_NAME)
  .max(50, INVALID_FIELDS.MAX_NAME);

export const lastNameYup = yupString
  .min(2, INVALID_FIELDS.MIN_NAME)
  .max(50, INVALID_FIELDS.MAX_NAME);

export const phoneYup = Yup.string()
  .trim()
  .matches(phoneRegExp, INVALID_FIELDS.PHONE_INVALID)
  .required(INVALID_FIELDS.REQUIRED);

export const phonePrefixYup = Yup.string()
  .trim()
  .matches(phonePrefix, INVALID_FIELDS.PHONE_INVALID)
  .required(INVALID_FIELDS.REQUIRED);

export const passwordConfirmYup = Yup.string()
  .required(INVALID_FIELDS.REQUIRED)
  .oneOf([Yup.ref('password'), null], INVALID_FIELDS.PASSWORD_NOT_MATCH);

export const genderYup = Yup.string().required(INVALID_FIELDS.REQUIRED);

export const dayOfBirthYup = Yup.object()
  .nullable()
  .required(INVALID_FIELDS.REQUIRED)
  .test('', INVALID_FIELDS.DAY_OF_BIRTH_CAN_NOT_BE_IN_THE_FUTURE, value => {
    return moment().diff(moment(value)) >= 0;
  });

export const phoneRequireYup = phoneYup.required(INVALID_FIELDS.REQUIRED);

export const nameYup = Yup.string().required(INVALID_FIELDS.REQUIRED);
export const numberYup = Yup.number().min(1).required(INVALID_FIELDS.REQUIRED);

export const userIdYup = yupString.min(1);

export const FORGOT_PASSWORD_FIELD = {
  password: passwordYup,
  verifyPassword: verifyPasswordYup,
};

export const CHANGE_PASSWORD_FIELD = {
  currentPassword: Yup.string().required(INVALID_FIELDS.REQUIRED),
  password: passwordYup,
  verifyPassword: verifyPasswordYup,
};

export const CHALLENGE_PASSWORD_REQUIRED = {
  password: passwordYup,
  passwordConfirm: passwordConfirmYup,
};

export const CHANGE_EMAIL_FIELD = {
  email: emailYup,
  password: passwordYup,
  // verifyPassword: verifyPasswordYub,
};

export const CREATE_MESSAGE_FIELDS = {
  name: Yup.string().required(),
  content: Yup.string().required(),
};

export const ADD_QUESTION_FIELDS = Yup.object().shape({
  title: Yup.string().required(INVALID_FIELDS.REQUIRED),
  type: Yup.string().required(INVALID_FIELDS.REQUIRED),
  masterCategoryId: Yup.string().required(INVALID_FIELDS.REQUIRED),
  masterSubCategoryId: Yup.string().required(INVALID_FIELDS.REQUIRED),
  masterVariableName: Yup.string().required(INVALID_FIELDS.REQUIRED),

  numberMin: Yup.string()
    .when('type', {
      is: QuestionType.SLIDER,
      then: Yup.string().required(INVALID_FIELDS.REQUIRED),
    })
    .when('type', {
      is: QuestionType.TEXT_NUMBER,
      then: Yup.string().required(INVALID_FIELDS.REQUIRED),
    }),
  numberMinLabel: Yup.string(),
  numberMax: Yup.string()
    .when('type', {
      is: QuestionType.SLIDER,
      then: Yup.string().required(INVALID_FIELDS.REQUIRED),
    })
    .when('type', {
      is: QuestionType.TEXT_NUMBER,
      then: Yup.string()
        .required(INVALID_FIELDS.REQUIRED)
        .test(
          'lessThanNumberMin',
          'numberMax must be great than numberMin',
          function (value) {
            const numberMin = this.parent.numberMin;
            if (value && numberMin) {
              return parseFloat(value) > parseFloat(numberMin);
            }
            return true;
          },
        ),
    }),
  numberMaxLabel: Yup.string(),
  numberStep: Yup.string().when('type', {
    is: QuestionType.SLIDER,
    then: Yup.string().required(INVALID_FIELDS.REQUIRED),
  }),
  maxDecimal: Yup.string().when('type', {
    is: QuestionType.TEXT_NUMBER,
    then: Yup.string().test(
      'isPositiveInteger',
      'MaxDecimal must be positive integer',
      function (value) {
        if (value) {
          return Number.isInteger(parseFloat(value)) && +value >= 0;
        }
        return true;
      },
    ),
  }),

  dateFormat: Yup.string()
    .nullable()
    .when('type', {
      is: QuestionType.DATE_PICKER,
      then: Yup.string().required(INVALID_FIELDS.REQUIRED),
    }),
  timeFormat: Yup.string()
    .nullable()
    .when('type', {
      is: QuestionType.TIME_PICKER,
      then: Yup.string().required(INVALID_FIELDS.REQUIRED),
    }),
  dataMatrix: Yup.object()
    .nullable()
    .when('type', {
      is: QuestionType.DATA_MATRIX,
      then: Yup.object().shape({
        rows: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string().required(INVALID_FIELDS.REQUIRED),
              keyPath: Yup.string().required(INVALID_FIELDS.REQUIRED),
              image: Yup.object().nullable(),
              description: Yup.string(),
            }),
          )
          .required(INVALID_FIELDS.REQUIRED)
          .min(1),
        columns: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string().required(INVALID_FIELDS.REQUIRED),
            }),
          )
          .required(INVALID_FIELDS.REQUIRED)
          .min(1),
      }),
    }),
  image: Yup.object().nullable(),
  // .when('type', {
  //   is: QuestionType.TEXT_GRAPHIC,
  //   then: Yup.object().required(INVALID_FIELDS.REQUIRED),
  // }),
  options: Yup.array()
    .when('type', {
      is: QuestionType.MULTIPLE_CHOICE,
      then: Yup.array()
        .of(
          Yup.object().shape({
            text: Yup.string().required(INVALID_FIELDS.REQUIRED),
          }),
        )
        .min(1),
    })
    .when('type', {
      is: QuestionType.RADIO_BUTTONS,
      then: Yup.array()
        .of(
          Yup.object().shape({
            text: Yup.string().required(INVALID_FIELDS.REQUIRED),
          }),
        )
        .min(1),
    })
    .when('type', {
      is: QuestionType.FORM_FIELD,
      then: Yup.array()
        .of(
          Yup.object().shape({
            text: Yup.string().required(INVALID_FIELDS.REQUIRED),
            keyPath: Yup.string().required(INVALID_FIELDS.REQUIRED),
          }),
        )
        .min(1),
    })
    .when('type', {
      is: QuestionType.PHOTO,
      then: Yup.array()
        .of(
          Yup.object().shape({
            text: Yup.string().required(INVALID_FIELDS.REQUIRED),
            imageUrl: Yup.mixed()
              .required(INVALID_FIELDS.REQUIRED)
              .test('fileFormat', 'PDF only', value => {
                return typeof value === 'string' || typeof value === 'object';
              }),
          }),
        )
        .min(1),
    })
    .when('type', {
      is: QuestionType.RANK_ORDER,
      then: Yup.array()
        .of(
          Yup.object().shape({
            text: Yup.string().required(INVALID_FIELDS.REQUIRED),
          }),
        )
        .min(2),
    }),
});

export const SURVEY_FORM_SCHEMA = {
  name: Yup.string().required(INVALID_FIELDS.REQUIRED),
  remark: Yup.string(),
};

const QUESTION_BLOCK_VALIDATION = {
  type: Yup.string().required(INVALID_FIELDS.REQUIRED),
  blockDescription: Yup.string()
    .nullable()
    .test(
      '',
      INVALID_FIELDS.REQUIRED,
      (
        value,
        values: {
          parent: {
            type?: SubSurveyFlowElement;
          };
        },
      ) => {
        if (values.parent?.type !== SubSurveyFlowElement.BLOCK) return true;
        return !!value;
      },
    ),
  endMessageId: Yup.string().nullable().test(
    '',
    'Message required',
    (
      value,
      values: { parent: { type?: SubSurveyFlowElement; } },
    ) => {
      if (values.parent?.type !== SubSurveyFlowElement.END_SURVEY) return true;
      return !!value;
    },
  ),
  surveyQuestions: Yup.array()
    .of(
      Yup.object().shape({
        questionVersionId: Yup.string().required(INVALID_FIELDS.REQUIRED),
        remark: Yup.string(),
        type: Yup.string().required(INVALID_FIELDS.REQUIRED),
        category: Yup.string().required(INVALID_FIELDS.REQUIRED),
      }),
    )
    .test(
      '',
      'Survey question required',
      (
        value,
        values: {
          parent: {
            type?: SubSurveyFlowElement;
          };
        },
      ) => {
        if (values.parent?.type !== SubSurveyFlowElement.BLOCK) return true;
        return !!value?.length;
      },
    ),
  listEmbeddedData: Yup.array()
    .of(
      Yup.object({
        field: Yup.string().required(INVALID_FIELDS.REQUIRED),
        value: Yup.string().required(INVALID_FIELDS.REQUIRED),
      }),
    )
    .test(
      '',
      'Embedded required',
      (
        value,
        values: {
          parent: {
            type?: SubSurveyFlowElement;
          };
        },
      ) => {
        if (values.parent?.type !== SubSurveyFlowElement.EMBEDDED_DATA)
          return true;
        return !!value?.length;
      },
    ),
  branchLogics: Yup.array()
    .of(
      Yup.object({
        operator: Yup.string().required(INVALID_FIELDS.REQUIRED),
        conjunction: Yup.string().required(INVALID_FIELDS.REQUIRED),
        logicType: Yup.string().required(INVALID_FIELDS.REQUIRED),
        row_column_BranchChoiceType: Yup.string().test(
          '',
          INVALID_FIELDS.REQUIRED,
          (
            value,
            values: {
              parent: ExtraSubBranchLogicDto;
            },
          ) => {
            const { questionType } = values.parent;
            if (!questionType) return true;
            if (
              ![QuestionType.DATA_MATRIX, QuestionType.FORM_FIELD].includes(
                questionType,
              )
            ) {
              return true;
            }
            return !!value;
          },
        ),
        blockSort_qId: Yup.string().test(
          '',
          INVALID_FIELDS.REQUIRED,
          (
            value,
            values: {
              parent: ExtraSubBranchLogicDto;
            },
          ) => {
            if (values.parent?.logicType !== BranchLogicType.QUESTION)
              return true;
            return !!value;
          },
        ),
        leftOperand: Yup.string().test(
          '',
          INVALID_FIELDS.REQUIRED,
          (
            value,
            values: {
              parent: ExtraSubBranchLogicDto;
            },
          ) => {
            const { logicType, questionType } = values.parent;
            if (logicType === BranchLogicType.EMBEDDED_FIELD) {
              return !!value;
            }
            if (!questionType) return true;

            if (
              ![
                QuestionType.MULTIPLE_CHOICE,
                QuestionType.RADIO_BUTTONS,
                QuestionType.RANK_ORDER,
              ].includes(questionType)
            )
              return true;
            return !!value;
          },
        ),
        rightOperand: Yup.string().test(
          '',
          INVALID_FIELDS.REQUIRED,
          (
            value,
            values: {
              parent: ExtraSubBranchLogicDto;
            },
          ) => {
            const { logicType, questionType, choiceType } = values.parent;
            if (logicType === BranchLogicType.EMBEDDED_FIELD) {
              return !!value;
            }
            if (!questionType) return true;

            if (questionType === QuestionType.DATA_MATRIX) {
              if (!choiceType) return true;
              if (
                [
                  BranchChoiceType.SELECTABLE_CHOICE,
                  BranchChoiceType.SELECTABLE_ANSWER,
                ].includes(choiceType)
              ) {
                return true;
              }
              return !!value;
            }

            if (
              ![
                QuestionType.FORM_FIELD,
                QuestionType.DATE_PICKER,
                QuestionType.TIME_PICKER,
                QuestionType.TEXT_ENTRY,
                QuestionType.TEXT_NUMBER,
                QuestionType.RANK_ORDER,
                QuestionType.SLIDER,
              ].includes(questionType)
            )
              return true;
            return !!value;
          },
        ),
      }),
    )
    .test(
      '',
      'Condition required',
      (
        value,
        values: {
          parent: {
            type?: SubSurveyFlowElement;
          };
        },
      ) => {
        if (values.parent?.type !== SubSurveyFlowElement.BRANCH) return true;
        return !!value?.length;
      },
    ),

  children: Yup.array()
    .transform(value => Object.values(value))
    .of(
      Yup.lazy(() =>
        Yup.object().shape(QUESTION_BLOCK_VALIDATION).default(undefined),
      ) as any,
    )
    .test(
      '',
      'Element required',
      (
        value,
        values: {
          parent: {
            type?: SubSurveyFlowElement;
          };
        },
      ) => {
        if (values.parent?.type !== SubSurveyFlowElement.BRANCH) return true;
        return !!value?.length;
      },
    ),
};

export const SURVEY_INTERNAL_FORM_SCHEMA = Yup.object().shape({
  duplicateSurveyId: Yup.string().when('template', {
    is: SurveyTemplateEnum.DUPLICATE,
    then: Yup.string().required(INVALID_FIELDS.REQUIRED),
  }),
  template: Yup.string().required(INVALID_FIELDS.REQUIRED),
  version: Yup.object()
    .when('template', {
      is: SurveyTemplateEnum.NEW,
      then: Yup.object().shape({
        ...SURVEY_FORM_SCHEMA,
        surveyFlowElements: Yup.array()
          // .min(1)
          .of(
            Yup.object().shape({
              ...QUESTION_BLOCK_VALIDATION,
            }),
          ),
      }),
    })
    .when('template', {
      is: SurveyTemplateEnum.DUPLICATE,
      then: Yup.object().shape(SURVEY_FORM_SCHEMA),
    }),
});

export const SURVEY_EXTERNAL_FORM_SCHEMA = Yup.object().shape({
  selectedRowKeys: Yup.array().of(Yup.string()).min(1).required(INVALID_FIELDS),
  version: Yup.object().shape({
    ...SURVEY_FORM_SCHEMA,
    questions: Yup.array()
      .of(
        Yup.object().test(
          'questionNotValid',
          'questions field is not valid',
          function (value, context) {
            const { selectedRowKeys } = context?.['from']?.[2]?.value;
            if (
              selectedRowKeys?.some(key => key === value?.questionVersionId)
            ) {
              return !!value.questionVersionId && !!value.parameter;
            }
            return true;
          },
        ),
      )
      .min(1),
  }),
});

export const PROJECT_FORM_SCHEMA = Yup.object().shape({
  name: Yup.string().required(INVALID_FIELDS.REQUIRED),
  description: Yup.string().required(INVALID_FIELDS.REQUIRED),
  personInCharge: Yup.string().required(INVALID_FIELDS.REQUIRED),
  type: Yup.string().required(INVALID_FIELDS.REQUIRED),
});

export const USER_FORM_SCHEMA = Yup.object().shape({
  firstName: firstNameYup.required(INVALID_FIELDS.REQUIRED),
  lastName: lastNameYup.required(INVALID_FIELDS.REQUIRED),
  email: emailYup,
});

export const INVITE_MEMBER_SCHEMA = Yup.object({
  firstName: firstNameYup.required(INVALID_FIELDS.REQUIRED).trim(),
  lastName: lastNameYup.required(INVALID_FIELDS.REQUIRED).trim(),
  email: emailYup,
  departmentName: Yup.string().required(INVALID_FIELDS.REQUIRED).trim(),
  roles: Yup.array().min(1, INVALID_FIELDS.REQUIRED),
});
