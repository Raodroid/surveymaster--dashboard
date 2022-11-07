import React, { FC, useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { QuestionBankService } from 'services';
import { IOptionItem, IQuestion, ISurveyQuestionDto, QuestionType } from 'type';
import _get from 'lodash/get';
import { Button, Input, Spin } from 'antd';
import Checkbox from 'antd/es/checkbox';
import { onError, useDebounce } from 'utils';
import { DisplayQuestionListWrapper } from './style';
import { useFormikContext } from 'formik';
import { IAddSurveyFormValues } from '../../SurveyForm';
import { useTranslation } from 'react-i18next';

interface IDisplayQuestionList {
  selectedCategoryId: string;
  onClose?: (e?: any) => void;
}

export const DisplayQuestionList: FC<IDisplayQuestionList> = props => {
  const { selectedCategoryId, onClose } = props;
  const [searchTxt, setSearchTxt] = useState<string>('');
  const debounceSearchText = useDebounce(searchTxt);
  const { t } = useTranslation();
  const [selectedQuestionIdList, setSelectedQuestionIdList] = useState<
    string[]
  >([]);

  const { setFieldValue, values } = useFormikContext<IAddSurveyFormValues>();

  const getQuestionByCategoryIdListQuery = useQuery(
    ['getQuestionByCategoryIdList', selectedCategoryId, debounceSearchText],
    () => {
      return QuestionBankService.getQuestions({
        categoryIds: [selectedCategoryId],
        q: debounceSearchText,
        hasLatestCompletedVersion: true,
      });
    },
    { onError, enabled: !!selectedCategoryId, refetchOnWindowFocus: false },
  );

  const questions = useMemo<IQuestion[]>(
    () => _get(getQuestionByCategoryIdListQuery.data, 'data.data', []),
    [getQuestionByCategoryIdListQuery.data],
  );

  const options = useMemo<IOptionItem[]>(() => {
    const result: IOptionItem[] = [];
    const questionIds: string[] = [];
    questions.forEach(q => {
      questionIds.push(q.latestCompletedVersion.id as string);
      result.push({
        label: q.latestCompletedVersion.title as string,
        value: q.latestCompletedVersion.id as string,
      });
    });
    setSelectedQuestionIdList(questionIds);
    return result;
  }, [questions]);

  const onChange = useCallback(values => {
    setSelectedQuestionIdList(values);
  }, []);

  const handleTyping = useCallback(
    e => {
      setSearchTxt(e.target.value);
    },
    [setSearchTxt],
  );

  const handleAddQuestions = useCallback(async () => {
    let sort = values.questions.length + 1;
    const newValues = selectedQuestionIdList.reduce(
      (
        result: Array<
          ISurveyQuestionDto & {
            type: QuestionType | string;
            category: string;
            id?: string;
          }
        >,
        chosenQuestionVersionId,
      ) => {
        const question = questions.find(
          (q: IQuestion) =>
            q.latestCompletedVersion.id === chosenQuestionVersionId,
        ) as IQuestion;

        if (
          values.questions.some(
            q => q.id === question?.id, // check if chosen version is in the same question but different version
          )
        ) {
          return result;
        }

        const transformData = {
          type: question.latestCompletedVersion.type,
          questionVersionId: chosenQuestionVersionId,
          category: question.masterCategory?.name as string,
          remark: '',
          sort,
          id: question.latestCompletedVersion.questionId,
          questionTitle: question.latestCompletedVersion.title,
        };
        sort += 1;

        return [...result, transformData];
      },
      [],
    );
    setFieldValue('questions', [...values.questions, ...newValues]);
    if (onClose) {
      onClose();
    }
  }, [onClose, questions, selectedQuestionIdList, setFieldValue, values]);

  return (
    <Spin spinning={getQuestionByCategoryIdListQuery.isLoading}>
      <DisplayQuestionListWrapper>
        <Input
          className={'search-input'}
          allowClear
          placeholder={`${t('common.searchQuestion')}...`}
          value={searchTxt}
          onChange={handleTyping}
        />
        <Checkbox.Group
          value={selectedQuestionIdList}
          options={options}
          onChange={onChange}
        />
        <Button
          type={'primary'}
          disabled={!selectedQuestionIdList.length}
          onClick={handleAddQuestions}
        >
          {t('common.add')} {selectedQuestionIdList.length}{' '}
          {t(
            `common.${
              selectedQuestionIdList.length === 1 ? 'question' : 'questions'
            }`,
          )}
        </Button>
      </DisplayQuestionListWrapper>
    </Spin>
  );
};
