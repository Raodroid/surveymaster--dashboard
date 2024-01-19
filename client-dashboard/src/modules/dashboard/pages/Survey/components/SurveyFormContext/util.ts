import {
  BranchLogicType,
  IQuestionVersion,
  ISurveyQuestionDto,
  ISurveyVersion,
  ISurveyVersionBaseDto,
  SubBranchLogicDto,
  SubEmbeddedDataDto,
  SubSurveyFlowElement,
  SubSurveyFlowElementDto,
  SurveyFlowElementResponseDto,
} from '@/type';
import {
  ExtraSubBranchLogicDto,
  IEditSurveyFormValues,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import _pick from 'lodash/pick';

export const createQuestionMap = (
  input: ISurveyVersion['surveyFlowElements'] = [],
  mapId: Record<string, IQuestionVersion>,
) => {
  input?.forEach(item => {
    item.surveyQuestions?.forEach(q => {
      const question = q.questionVersion;

      const keyID = question.id as string;

      if (question) {
        if (!mapId[keyID]) {
          mapId[keyID] = question;
        }
      }
    });

    if (item.children) {
      createQuestionMap(item.children, mapId);
    }
  });
};

export const transSurveyFLowElement = (
  input:
    | SurveyDataTreeNode[]
    | SurveyFlowElementResponseDto[]
    | SubSurveyFlowElementDto[],
  blockSortCounting: number,
): SubSurveyFlowElementDto[] => {
  let newBlockSortCounting = blockSortCounting;

  return input.map((i, idx) => {
    let blockSort = i.blockSort;

    if (i.type === SubSurveyFlowElement.BLOCK) {
      if (i.blockSort === undefined) {
        blockSort = newBlockSortCounting;
        newBlockSortCounting += 1;
      } else {
        newBlockSortCounting = blockSort + 1;
      }
    }

    const surveyQuestions: ISurveyQuestionDto[] | undefined = !i.surveyQuestions
      ?.length
      ? undefined
      : i.surveyQuestions.map((i, surveyQuestionsIndex) => ({
          ...i,
          sort: surveyQuestionsIndex + 1,
          remarks:
            i.remarks?.length === 0
              ? undefined
              : i.remarks?.map(rm => ({
                  id: rm?.id,
                  remark: rm.remark,
                  ownerId: rm.id ? rm?.owner?.id : undefined,
                })),
        }));

    const branchLogics: SubBranchLogicDto[] =
      i.type === SubSurveyFlowElement.BRANCH
        ? i.branchLogics?.map((logic: ExtraSubBranchLogicDto, logicIndex) => {
            const {
              blockSort_qId,
              sort,
              row_column_BranchChoiceType,
              column,
              row,
              optionSort,
              questionType,
              ...rest
            } = logic;

            if (logic.logicType === BranchLogicType.EMBEDDED_FIELD) {
              const x = _pick(logic, [
                'conjunction',
                'logicType',
                'sort',
                'operator',
                'rightOperand',
                'leftOperand',
                'id',
              ]);
              return { ...x, sort: logicIndex + 1 };
            }

            return {
              ...rest,
              column: typeof column !== 'number' ? undefined : column,
              row: typeof row !== 'number' ? undefined : row,
              sort: logicIndex + 1,
              optionSort: Number.isInteger(optionSort) ? optionSort : undefined,
            };
          })
        : undefined;

    const listEmbeddedData: SubEmbeddedDataDto[] =
      i.type === SubSurveyFlowElement.EMBEDDED_DATA
        ? i.listEmbeddedData
        : undefined;

    return {
      id: i?.id,
      blockSort,
      type: i.type,
      sort: idx,
      blockDescription: i.blockDescription,
      surveyQuestions,
      branchLogics,
      listEmbeddedData,
      children: transSurveyFLowElement(i?.children || [], newBlockSortCounting),
    };
  });
};

export const transformSurveyVersion = (
  values: IEditSurveyFormValues,
): ISurveyVersionBaseDto => {
  const blockSortCounting = 0;
  const surveyFlowElements: SubSurveyFlowElementDto[] = transSurveyFLowElement(
    values.version?.surveyFlowElements || [],
    blockSortCounting,
  );

  return { ...values.version, surveyFlowElements };
};
