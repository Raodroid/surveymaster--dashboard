import { ISurvey, ISurveyVersion, SurveyVersionStatus } from '@/type';

export const surveyVersionMock: ISurveyVersion = {
  surveyFlowElements: [],
  createdAt: '2023-03-16T09:58:02.981Z',
  updatedAt: '2023-03-16T09:58:02.981Z',
  deletedAt: null,
  id: '147',
  displayId: 'X57N-M726-JKUX',
  name: 'test survey',
  remark: '',
  status: SurveyVersionStatus.DRAFT,
};

export const surveyMock: ISurvey = {
  createdBy: {
    firstName: 'hannah',
    lastName: 'lee',
  },
  createdAt: '2023-03-16T09:58:02.981Z',
  updatedAt: '2023-03-16T09:58:02.981Z',
  deletedAt: null,
  id: '124',
  displayId: 'Z2F7-U8NM-7FU3',
  projectId: '31',
  versions: [
    { ...surveyVersionMock },
    // {
    //   createdAt: '2023-03-17T05:11:31.965Z',
    //   updatedAt: '2023-03-17T05:11:31.965Z',
    //   deletedAt: null,
    //   id: '148',
    //   displayId: 'Y2UG-N6DP-5TPX',
    //   name: 'test survey ',
    //   numberOfQuestions: 2,
    //   remark: 'version 01',
    //   status: SurveyVersionStatus.DRAFT,
    //   questions: [
    //     {
    //       surveyId: '142',
    //       id: '980',
    //       questionVersionId: '78',
    //       sort: 2,
    //       remark: '',
    //       questionVersion: {
    //         createdBy: {
    //           firstName: 'hannah',
    //           lastName: 'lee',
    //         },
    //         createdAt: '2023-03-03T03:36:16.818Z',
    //         updatedAt: '2023-03-03T03:36:42.208Z',
    //         deletedAt: null,
    //         id: '77',
    //         displayId: 'ABC',
    //         questionId: '60',
    //         title: 'what is your breakfast',
    //         type: QuestionType.DATA_MATRIX,
    //         dataMatrix: {
    //           rows: [
    //             { name: 'item 1', keyPath: '', image: '' },
    //             { name: 'item 2', keyPath: '', image: '' },
    //           ],
    //           columns: [{ name: 'Quantity' }, { name: 'Coffeee' }],
    //         },
    //         latestVersionOfQuestionId: '60',
    //         latestCompletedVersionOfQuestionId: '60',
    //         matrixType: MatrixType.RADIO_BUTTON,
    //         status: QuestionVersionStatus.COMPLETED,
    //       },
    //     },
    //     {
    //       surveyId: '142',
    //       id: '980',
    //       questionVersionId: '78',
    //       sort: 2,
    //       remark: '',
    //       questionVersion: {
    //         createdBy: {
    //           firstName: 'hannah',
    //           lastName: 'lee',
    //         },
    //         createdAt: '2023-03-03T03:36:16.818Z',
    //         updatedAt: '2023-03-03T03:36:42.208Z',
    //         deletedAt: null,
    //         id: '78',
    //         displayId: '3EAM-XG44-ZGYT',
    //         questionId: '60',
    //         title: 'what is your breakfast',
    //         type: QuestionType.DATA_MATRIX,
    //         dataMatrix: {
    //           rows: [
    //             { name: 'item 1', keyPath: '', image: '' },
    //             { name: 'item 2', keyPath: '', image: '' },
    //           ],
    //           columns: [{ name: 'Quantity' }, { name: 'Coffeee' }],
    //         },
    //         latestVersionOfQuestionId: '60',
    //         latestCompletedVersionOfQuestionId: '60',
    //         matrixType: MatrixType.RADIO_BUTTON,
    //         status: QuestionVersionStatus.COMPLETED,
    //       },
    //     },
    //   ],
    // },
  ],
  latestVersion: surveyVersionMock,
  latestCompletedVersion: surveyVersionMock,
};
