import {
  ISurveyVersionBaseDto,
  SubSurveyFlowElement,
  SubSurveyFlowElementDto,
  SurveyFlowElementResponseDto,
} from '@/type';
import {
  IAddSurveyFormValues,
  SurveyFlowElements,
} from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/type';
import { genQualtricsBlockId } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/utils';

const getBlockId = (
  input: SurveyFlowElements[],
  result: Record<string, string>,
) => {
  input.forEach((i, idx) => {
    result[i.blockId] = genQualtricsBlockId();

    if (i.children) {
      getBlockId(i?.children, result);
    }
  });
};

export const transSurveyFLowElement = (
  input: SurveyFlowElements[] | SurveyFlowElementResponseDto[],
  mapBlockId: Record<string, string>,
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
      blockId: mapBlockId[i.blockId] || i.blockId,
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
          ? i.branchLogics?.map(branch => ({
              ...branch,
              blockId: mapBlockId[branch?.blockId as string] || branch.blockId,
            }))
          : undefined,
      listEmbeddedData:
        i.type === SubSurveyFlowElement.EMBEDDED_DATA
          ? i.listEmbeddedData
          : undefined,
      children: transSurveyFLowElement(
        i?.children || [],
        mapBlockId,
        newBlockSortCounting,
      ),
    };
  });
};

export const transformSurveyVersion = (
  values: IAddSurveyFormValues,
  shouldUpdateBlockId?: boolean,
): ISurveyVersionBaseDto => {
  const mapBlockId: Record<string, string> = {};

  let blockSortCounting = 0;

  if (shouldUpdateBlockId) {
    getBlockId(values.version?.surveyFlowElements || [], mapBlockId);
  }
  const surveyFlowElements: SubSurveyFlowElementDto[] = transSurveyFLowElement(
    values.version?.surveyFlowElements || [],
    mapBlockId,
    blockSortCounting,
  );

  return { ...values.version, surveyFlowElements };
};
