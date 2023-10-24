import {
  ISurveyVersionBaseDto,
  SubSurveyFlowElement,
  SubSurveyFlowElementDto,
  SurveyFlowElementResponseDto,
} from '@/type';
import {
  IAddSurveyFormValues,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';

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
        i.type === SubSurveyFlowElement.BRANCH ? i.branchLogics : undefined,
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
