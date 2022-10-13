import { ControlledInput } from 'modules/common';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import { Button } from 'antd';
import {
  GetListQuestionDto,
  IOptionItem,
  IQuestion,
  IQuestionVersionOption,
  QuestionType,
} from 'type';
import { FieldArrayRenderProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { DragIcon, TrashOutlined } from 'icons';
import { INPUT_TYPES } from '../../../../../../../../common/input/type';
import { onError, transformEnumToOption, useDebounce } from 'utils';
import { useInfiniteQuery } from 'react-query';
import { QuestionBankService } from 'services';
import {
  IAddSurveyFormValues,
  initNewQuestionOnAddSurveyForm,
} from '../AddSurveyForm';
import {
  reorder,
  StrictModeDroppable,
} from '../../../../../../QuestionBank/EditQuestion/DisplayAnswerList/DragAnswerList';

const initParams: GetListQuestionDto = {
  q: '',
  take: 10,
  page: 1,
  hasLatestCompletedVersion: true,
};

const DragOption: FC<{
  opt: IQuestionVersionOption;
  index: number;
  arrayHelpers: FieldArrayRenderProps;

  data: any;
  isLoading: boolean;
  fetchNextPage: any;
  hasNextPage?: boolean;
  setSearchTxt: (value: string) => void;
}> = props => {
  const {
    opt,
    index,
    arrayHelpers,
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    setSearchTxt,
  } = props;
  const { t } = useTranslation();
  const { setFieldValue, values } = useFormikContext<IAddSurveyFormValues>();

  const [questionOption, normalizeByQuestionId] = useMemo<
    [IOptionItem[], Record<string, IQuestion>]
  >(() => {
    if (!data) return [[], {}];

    const currQuestionVersionId = values.questions[index].questionVersionId;

    const options: IOptionItem[] = [];
    if (currQuestionVersionId) {
      options.push({
        label: values.questions[index].questionTitle,
        value: currQuestionVersionId,
      });
    }

    const normalizeByQuestionId: Record<string, IQuestion> = {};

    return [
      data.pages.reduce((current, page) => {
        const nextPageData = page.data.data;
        nextPageData.forEach((question: IQuestion) => {
          if (
            values.questions.some(
              q => q.questionVersionId === question.latestCompletedVersion.id, //filter out question was currently selected
            ) ||
            question.latestCompletedVersion.id === currQuestionVersionId
          ) {
            return current;
          }
          normalizeByQuestionId[question.latestCompletedVersion.id as string] =
            question;

          current.push({
            label: question?.latestCompletedVersion?.title,
            value: question.latestCompletedVersion.id as string,
          });
        });
        return current;
      }, options),
      normalizeByQuestionId,
    ];
  }, [data, index, values.questions]);

  const fetch = useCallback(
    async target => {
      target.scrollTo(0, target.scrollHeight);

      if (hasNextPage) {
        await fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage],
  );
  const onScroll = useCallback(
    async event => {
      let target = event.target;
      if (
        !isLoading &&
        target.scrollTop + target.offsetHeight === target.scrollHeight
      ) {
        await fetch(target);
      }
    },
    [fetch, isLoading],
  );

  const handleOnChange = useCallback(
    value => {
      const chooseQuestion = normalizeByQuestionId[value];
      if (chooseQuestion) {
        setFieldValue(
          `questions[${index}].category`,
          chooseQuestion.masterCategory?.name,
        );
        setFieldValue(
          `questions[${index}].type`,
          chooseQuestion.latestCompletedVersion.type,
        );
        setFieldValue(
          `questions[${index}].questionTitle`,
          chooseQuestion.latestCompletedVersion.title,
        );
      }
    },
    [index, normalizeByQuestionId, setFieldValue],
  );
  return (
    <Draggable draggableId={`item${opt.id}`} index={index} key={opt.id}>
      {provided => (
        <div
          className={'DisplayQuestionSurveyListWrapper__row'}
          key={index}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={'DisplayQuestionSurveyListWrapper__row__item first'}>
            <DragIcon />

            <span> {index + 1}</span>
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item second'}>
            <ControlledInput
              allowClear
              inputType={INPUT_TYPES.SELECT}
              name={`questions[${index}].questionVersionId`}
              onPopupScroll={onScroll}
              onChange={handleOnChange}
              onSearch={value => {
                setSearchTxt(value);
              }}
              filterOption={false}
              showSearch
              options={questionOption}
              isFastField={false}
            />
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item third'}>
            <ControlledInput
              disabled
              suffixIcon={null}
              inputType={INPUT_TYPES.INPUT}
              name={`questions[${index}].category`}
            />
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item forth'}>
            <ControlledInput
              disabled
              suffixIcon={null}
              inputType={INPUT_TYPES.SELECT}
              name={`questions[${index}].type`}
              options={transformEnumToOption(QuestionType, questionType =>
                t(`questionType.${questionType}`),
              )}
            />
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item fifth'}>
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name={`questions[${index}].remark`}
            />
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item sixth'}>
            <Button
              className={'delete-icon'}
              onClick={() => {
                arrayHelpers.remove(index);
                if (arrayHelpers.form?.[arrayHelpers.name]?.length === 0) {
                  arrayHelpers.push({
                    ...initNewQuestionOnAddSurveyForm,
                    id: Math.random().toString(),
                  });
                }
              }}
              icon={
                <span>
                  <TrashOutlined />
                </span>
              }
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

const OptionList = React.memo(function QuoteListA(props: {
  items: IQuestionVersionOption[];
  arrayHelpers: FieldArrayRenderProps;
}) {
  const { items, arrayHelpers } = props;
  const { t } = useTranslation();

  const [searchTxt, setSearchTxt] = useState<string>('');

  const debounceSearchText = useDebounce(searchTxt);

  const currentParam = useMemo<GetListQuestionDto>(
    () => ({
      ...initParams,
      q: debounceSearchText,
    }),
    [debounceSearchText],
  );

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['getQuestionList', currentParam],
    ({ pageParam = currentParam }) => {
      return QuestionBankService.getQuestions({
        ...pageParam,
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.hasNextPage
          ? { ...currentParam, page: lastPage.data.page + 1 }
          : false;
      },
      onError,
    },
  );
  return (
    <>
      <div className={'DisplayQuestionSurveyListWrapper__row'}>
        <div className={'DisplayQuestionSurveyListWrapper__row__item first'}>
          <span style={{ marginLeft: 'auto' }}>{t('common.order')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item second'}>
          <span>{t('common.question')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item third'}>
          <span>{t('common.questionCategory')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item forth'}>
          <span>{t('common.type')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item fifth'}>
          <span>{t('common.remarks')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item sixth'} />
      </div>
      {(items || []).map((option: IQuestionVersionOption, index: number) => {
        return (
          <DragOption
            opt={option}
            index={index}
            key={option.id || option.sort}
            arrayHelpers={arrayHelpers}
            data={data}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            setSearchTxt={setSearchTxt}
          />
        );
      })}
    </>
  );
});

const DragQuestionSurveyList: FC<{
  questions: IQuestionVersionOption[];
  arrayHelpers: FieldArrayRenderProps;
}> = props => {
  const { questions, arrayHelpers } = props;

  const { setFieldValue } = useFormikContext();

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }

    setFieldValue(
      'questions',
      reorder(questions, result.source.index, result.destination.index),
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="DragQuestionSurveyList-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <OptionList items={questions} arrayHelpers={arrayHelpers} />
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default DragQuestionSurveyList;
