const createProjectRoute = (path: string) => {
  return {
    HOME: `/app/project/${path}`,
    ADD_NEW_SURVEY: `/app/project/${path}/add-survey`,
    SURVEY_LIST: `/app/project/${path}/survey-list`,
  };
};

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
      MICROBIOME_DONOR_PROGRAMME: createProjectRoute(
        'microbiome-donor-programme',
      ),
      NCCS_ELEGANCE: createProjectRoute('NCCS-elegance'),
      AMILI_MONASH_GUT_MICROBIOME: createProjectRoute(
        'amili-monash-gut-microbiome',
      ),
      COLON_T2: createProjectRoute('colon-t2'),
    },
    PROFILE: '/app/profile',
    QUESTION_BANK: '/app/question-bank',
  },
};
