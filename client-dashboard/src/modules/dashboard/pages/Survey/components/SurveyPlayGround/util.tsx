import {
  BranchLogicType,
  ISurveyVersionBaseDto,
  SubSurveyFlowElement,
  SubSurveyFlowElementDto,
  SurveyFlowElementResponseDto,
} from '@/type';
import {
  IAddSurveyFormValues,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import _pick from 'lodash/pick';

export const transSurveyFLowElement = (
  input: SurveyDataTreeNode[] | SurveyFlowElementResponseDto[],
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

    return {
      blockSort,
      type: i.type,
      sort: idx,
      blockDescription: i.blockDescription,
      surveyQuestions: !i.surveyQuestions?.length
        ? undefined
        : i.surveyQuestions?.map((q, qIndex) => ({
            ...q,
            sort: qIndex,
          })),
      branchLogics:
        i.type === SubSurveyFlowElement.BRANCH
          ? i.branchLogics?.map((logic, logicIndex) => {
              const { blockSort_qId, sort, row, column, ...rest } = logic;

              if (logic.logicType === BranchLogicType.EMBEDDED_FIELD) {
                const x = _pick(logic, [
                  'conjunction',
                  'logicType',
                  'sort',
                  'operator',
                  'rightOperand',
                  'leftOperand',
                ]);
                return { ...x, sort: logicIndex + 1 };
              }

              return {
                ...rest,
                sort: logicIndex + 1,
              };
            })
          : undefined,
      listEmbeddedData:
        i.type === SubSurveyFlowElement.EMBEDDED_DATA
          ? i.listEmbeddedData
          : undefined,
      children: transSurveyFLowElement(i?.children || [], newBlockSortCounting),
    };
  });
};

export const transformSurveyVersion = (
  values: IAddSurveyFormValues,
): ISurveyVersionBaseDto => {
  let blockSortCounting = 0;
  const surveyFlowElements: SubSurveyFlowElementDto[] = transSurveyFLowElement(
    values.version?.surveyFlowElements || [],
    blockSortCounting,
  );

  return { ...values.version, surveyFlowElements };
};
