export const ROUTE_PATH = {
  HOME: '/',
  LOGIN: '/login',
  NOTFOUND: '/404-not-found',
  VERIFY: '/verify',
  VERIFY_SUCCESS: '/verify-success',
  RESET_PASSWORD: '/reset-password',
  CONFIRM_SMS: '/confirm-sms',
  CHANGE_PASSWORD_CHALLENGE: '/change-password',
  DASHBOARD_PATHS: {
    HOME: '/app',
    PROJECT: {
      HOME: '/app/project',
      SURVEY: '/app/project/:id',
      ADD_NEW_SURVEY: '/app/project/:id/add-survey',
      SURVEY_LIST: '/app/project/:id/survey-list',
    },
    PROFILE: '/app/profile',
    QUESTION_BANK: '/app/question-bank',
  },
};
