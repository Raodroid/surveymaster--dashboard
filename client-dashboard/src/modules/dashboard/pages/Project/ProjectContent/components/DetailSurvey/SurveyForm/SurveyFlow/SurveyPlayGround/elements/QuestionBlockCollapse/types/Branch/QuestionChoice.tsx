import React, { FC, useMemo } from 'react';
import { DynamicSelect } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/DisplayAnswer/DisplayAnswer';
import { IOptionItem, IQuestion } from '@/type';
import { useField, useFormikContext } from 'formik';
import {
  IAddSurveyFormValues,
  questionValueType,
} from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyForm';

interface IQuestionChoice {
  fieldName: string;
}

const QuestionChoice: FC<IQuestionChoice> = props => {
  const { fieldName } = props;

  const { values } = useFormikContext<IAddSurveyFormValues>();
  const { questionIdMap, version } = values;

  const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);
  //load question Data form same level or all level
  const questionListData = useMemo(() => {
    return [];
    // return version?.surveyFlowElements?.forEach(() => {});
  }, []);

  // const [questionOption, normalizeByQuestionId] = useMemo<
  //   [IOptionItem[], Record<string, IQuestion>]
  // >(() => {
  //   if (!questionListData) return [[], {}];
  //
  //   const normalizeByQuestionId: Record<string, IQuestion> = {};
  //   return [
  //     questionListData.reduce((current: IOptionItem[], page) => {
  //       const nextPageData = page.data.data || [];
  //       nextPageData.forEach((q: IQuestion) => {
  //         const latestQuestionVersionId = q.latestCompletedVersion?.id;
  //         const latestQuestionId = q?.id;
  //         if (
  //           value?.some(
  //             z =>
  //               z.id === latestQuestionId || // check if chosen version is in the same question but different version
  //               z.questionVersionId === latestQuestionVersionId, //check and filter out questions were automatically filled after uploading file
  //           )
  //         ) {
  //           return current;
  //         }
  //
  //         normalizeByQuestionId[latestQuestionVersionId as string] = q;
  //
  //         current.push({
  //           label: q?.latestCompletedVersion?.title,
  //           value: latestQuestionVersionId as string,
  //         });
  //       });
  //       return current;
  //     }, []),
  //     normalizeByQuestionId,
  //   ];
  // }, [questionListData, value]);

  return (
    <div>
      {/*<DynamicSelect*/}
      {/*  setSearchTxt={() => {}}*/}
      {/*  normalizeByQuestionId={questionIdMap}*/}
      {/*  questionOption={[]}*/}
      {/*  hasNextPage={false}*/}
      {/*  fetchNextPage={() => {}}*/}
      {/*  isLoading={false}*/}
      {/*  fieldName={fieldName}*/}
      {/*/>*/}
    </div>
  );
};

export default QuestionChoice;
