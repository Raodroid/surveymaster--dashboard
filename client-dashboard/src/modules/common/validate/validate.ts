import * as Yup from 'yup';
import moment from 'moment';

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

export const CHALLENGE_PASSWORD_REQUIRED = {
  password: passwordYup,
  passwordConfirm: passwordConfirmYup,
};

export const CHANGE_EMAIL_FIELD = {
  email: emailYup,
  password: passwordYup,
  // verifyPassword: verifyPasswordYub,
};
