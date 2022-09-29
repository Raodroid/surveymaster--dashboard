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
      ADD_NEW_PROJECT: '/app/project/add-project',
      DONOR_V2: '/app/project/:id/microbiome-donor-v2',
    },
    PROFILE: '/app/profile',
    QUESTION_BANK: {
      ROOT: '/app/question-bank',
      EDIT_QUESTION: '/app/question-bank/:questionId/edit',
      VIEW_QUESTION: '/app/question-bank/:questionId',
      ADD_QUESTION: '/app/question-bank/question/add',
    },
  },
};
