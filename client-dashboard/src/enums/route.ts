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
      ROOT: '/app/project',
      SURVEY: '/app/project/:id',
      ADD_NEW_SURVEY: '/app/project/:id/add-survey',
      ADD_NEW_PROJECT: '/app/project/add-project',
      DETAIL_SURVEY: {
        ROOT: '/app/project/:id/:detailId',
        EDIT: '/app/project/:id/:detailId/edit',
      },
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
