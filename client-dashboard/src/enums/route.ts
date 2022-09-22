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
    PROJECT: '/app/project',
    PROFILE: '/app/profile',
    QUESTION_BANK: {
      ROOT: '/app/question-bank',
      EDIT_QUESTION: '/app/question-bank/:questionId/edit',
      VIEW_QUESTION: '/app/question-bank/:questionId',
      ADD_QUESTION: '/app/question-bank/question/add',
    },
  },
};
