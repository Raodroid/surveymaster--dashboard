import { ControlledInput } from 'modules/common';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import { Button, Menu } from 'antd';
import {
  GetListQuestionDto,
  IOptionItem,
  IQuestion,
  IQuestionVersion,
  QuestionType,
} from 'type';
import { FieldArrayRenderProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ArrowDown, DragIcon, TrashOutlined } from 'icons';
import { INPUT_TYPES } from '../../../../../../../../common/input/type';
import { onError, transformEnumToOption, useDebounce } from 'utils';
import { useInfiniteQuery } from 'react-query';
import { QuestionBankService } from 'services';
import {
  IAddSurveyFormValues,
  initNewQuestionOnAddSurveyForm,
  questionValueType,
} from '../SurveyForm';
import {
  reorder,
  StrictModeDroppable,
} from '../../../../../../QuestionBank/EditQuestion/DisplayAnswerList/DragAnswerList';
import moment from 'moment';
import { MOMENT_FORMAT } from '../../../../../../../../../enums';
import ThreeDotsDropdown from '../../../../../../../../../customize-components/ThreeDotsDropdown';
import UncontrollInput from '../../../../../../../../common/input/uncontrolled-input/UncontrollInput';
import { SuffixIcon } from '../../../../../../../../../icons/SuffixIcon';

enum ACTION_ENUM {
  DELETE = 'DELETE',
  CHANGE = 'CHANGE',
}

const initParams: GetListQuestionDto = {
  q: '',
  take: 10,
  page: 1,
  hasLatestCompletedVersion: true,
};

const DragOption: FC<{
  opt: questionValueType;
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
  const { setFieldValue, values, setValues, initialValues, getFieldMeta } =
    useFormikContext<IAddSurveyFormValues>();

  const { value, initialValue } = getFieldMeta(
    `questions[${index}].questionVersionId`,
  );

  const isDirty = value !== initialValue;

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

  const [newVersions, historyVersions] = useMemo<
    [IQuestionVersion[] | undefined, IQuestionVersion[] | undefined]
  >(() => {
    const versions = values.questions[index].versions;

    if (!versions) return [undefined, undefined];

    const newVersions: IQuestionVersion[] = [];
    const historyVersions: IQuestionVersion[] = [];

    let chosenValueIdx: undefined | number = undefined;

    versions?.forEach((ver, idx) => {
      const isCurrentValue =
        ver.id === values.questions[index].questionVersionId;

      if (chosenValueIdx !== undefined && idx > chosenValueIdx) {
        historyVersions.push(ver);
        return;
      }

      if (isCurrentValue) {
        chosenValueIdx = idx;
      }
      newVersions.push(ver);
    }, []);

    return [newVersions, historyVersions];
  }, [index, values.questions]);

  const RenderContent = () => {
    const [show, setShow] = useState(false);

    return (
      <>
        <div className={'DisplayQuestionSurveyListWrapper__row__item first'}>
          <DragIcon />
          <span> {index + 1}</span>
        </div>

        <div className={'DisplayQuestionSurveyListWrapper__row__item second'}>
          {!newVersions ? (
            <div className={'question-info-wrapper'}>
              <div className={'question'}>
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
              <div className={'category'}>
                <ControlledInput
                  disabled
                  suffixIcon={null}
                  inputType={INPUT_TYPES.INPUT}
                  name={`questions[${index}].category`}
                />
              </div>
              <div className={'question-type'}>
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
            </div>
          ) : (
            <>
              {newVersions.map((ver, idx) => {
                const isCurrentValue =
                  ver.id === values.questions[index].questionVersionId;

                return isCurrentValue ? (
                  <div className={'question-info-wrapper'} key={ver.id}>
                    <div className={'question'}>
                      <div className={'question-label-info'}>
                        <span className={'status-question success-color'} />{' '}
                        <span>
                          {moment(ver.updatedAt).format(
                            MOMENT_FORMAT.FULL_DATE_FORMAT,
                          )}
                        </span>
                        {isDirty && idx === 0 && (
                          <span
                            className={'decline-change-btn'}
                            onClick={() => {
                              setValues(values => ({
                                ...values,
                                questions: values.questions.map((q, idx) => {
                                  if (idx === index) {
                                    return {
                                      ...q,
                                      questionVersionId: initialValue as string,
                                      questionTitle:
                                        initialValues.questions[index]
                                          .questionTitle,
                                    };
                                  }
                                  return q;
                                }),
                              }));
                            }}
                          >
                            {t('common.declineChange')}
                          </span>
                        )}
                      </div>
                      <ControlledInput
                        disabled
                        inputType={INPUT_TYPES.SELECT}
                        name={`questions[${index}].questionVersionId`}
                        options={questionOption}
                        suffixIcon={null}
                      />
                      {!!historyVersions?.length && (
                        <span
                          className={'show-history-btn'}
                          onClick={() => setShow(s => !s)}
                        >
                          {t(
                            `common.${
                              show ? 'closeHistoryList' : 'showHistoryList'
                            }`,
                          )}{' '}
                          <ArrowDown
                            style={{
                              transform: show ? 'rotateX(180deg)' : 'none',
                            }}
                          />
                        </span>
                      )}
                    </div>

                    <div className={'category'}>
                      <ControlledInput
                        disabled
                        suffixIcon={null}
                        inputType={INPUT_TYPES.INPUT}
                        name={`questions[${index}].category`}
                      />
                    </div>
                    <div className={'question-type'}>
                      <ControlledInput
                        disabled
                        suffixIcon={null}
                        inputType={INPUT_TYPES.SELECT}
                        name={`questions[${index}].type`}
                        options={transformEnumToOption(
                          QuestionType,
                          questionType => t(`questionType.${questionType}`),
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={'question-info-wrapper'} key={ver.id}>
                    <div className={'question'}>
                      <div className={'question-label-info'}>
                        <span className={'status-question warning-color'} />{' '}
                        <span>
                          {moment(ver.updatedAt).format(
                            MOMENT_FORMAT.FULL_DATE_FORMAT,
                          )}
                        </span>
                      </div>
                      <UncontrollInput
                        disabled
                        inputType={INPUT_TYPES.INPUT}
                        name={`questions[${index}].questionVersionId`}
                        value={ver.title}
                      />
                    </div>

                    <div className={'category'}>
                      <ControlledInput
                        disabled
                        suffixIcon={null}
                        inputType={INPUT_TYPES.INPUT}
                        name={`questions[${index}].category`}
                      />
                    </div>
                    <div className={'question-type'}>
                      <UncontrollInput
                        disabled
                        suffixIcon={null}
                        inputType={INPUT_TYPES.SELECT}
                        value={ver.type}
                        options={transformEnumToOption(
                          QuestionType,
                          questionType => t(`questionType.${questionType}`),
                        )}
                      />
                    </div>
                  </div>
                );
              })}

              {show &&
                historyVersions?.map((ver, idx) => {
                  return (
                    <div className={'question-info-wrapper'} key={ver.id}>
                      <div className={'question'}>
                        <div className={'question-label-info'}>
                          <span className={'status-question warning-color'} />{' '}
                          <span>
                            {moment(ver.updatedAt).format(
                              MOMENT_FORMAT.FULL_DATE_FORMAT,
                            )}
                          </span>
                        </div>
                        <UncontrollInput
                          disabled
                          inputType={INPUT_TYPES.INPUT}
                          name={`questions[${index}].questionVersionId`}
                          value={ver.title}
                        />
                      </div>

                      <div className={'category'}>
                        <ControlledInput
                          disabled
                          suffixIcon={null}
                          inputType={INPUT_TYPES.INPUT}
                          name={`questions[${index}].category`}
                        />
                      </div>
                      <div className={'question-type'}>
                        <UncontrollInput
                          disabled
                          suffixIcon={null}
                          inputType={INPUT_TYPES.SELECT}
                          value={ver.type}
                          options={transformEnumToOption(
                            QuestionType,
                            questionType => t(`questionType.${questionType}`),
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>

        <div className={'DisplayQuestionSurveyListWrapper__row__item third'}>
          <ControlledInput
            inputType={INPUT_TYPES.TEXTAREA}
            name={`questions[${index}].remark`}
          />
        </div>

        <div className={'DisplayQuestionSurveyListWrapper__row__item forth'}>
          {!newVersions || newVersions.length === 1 ? (
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
          ) : (
            <ThreeDotsDropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key={ACTION_ENUM.DELETE}
                    onClick={() => {
                      arrayHelpers.remove(index);
                      if (
                        arrayHelpers.form?.[arrayHelpers.name]?.length === 0
                      ) {
                        arrayHelpers.push({
                          ...initNewQuestionOnAddSurveyForm,
                          id: Math.random().toString(),
                        });
                      }
                    }}
                  >
                    <TrashOutlined /> {t('common.delete')}
                  </Menu.Item>
                  <Menu.Item
                    key={ACTION_ENUM.CHANGE}
                    onClick={() => {
                      setValues(values => ({
                        ...values,
                        questions: values.questions.map((q, idx) => {
                          if (idx === index) {
                            return {
                              ...q,
                              questionVersionId: newVersions[0].id as string,
                              questionTitle: newVersions[0].title as string,
                            };
                          }
                          return q;
                        }),
                      }));
                    }}
                  >
                    <SuffixIcon /> {t('common.change')}
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            />
          )}
        </div>
      </>
    );
  };

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
          <RenderContent />
        </div>
      )}
    </Draggable>
  );
};

const OptionList = React.memo(function QuoteListA(props: {
  items: questionValueType[];
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
      <div className={'DisplayQuestionSurveyListWrapper__row title-column'}>
        <div className={'DisplayQuestionSurveyListWrapper__row__item first'}>
          <span style={{ marginLeft: 'auto' }}>{t('common.order')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item second'}>
          <div className={'question-info-wrapper'}>
            <div className={'question'}>
              <span>{t('common.question')}</span>
            </div>
            <div className={'category'}>
              <span>{t('common.questionCategory')}</span>
            </div>
            <div className={'question-type'}>
              <span>{t('common.type')}</span>
            </div>
          </div>
        </div>

        <div className={'DisplayQuestionSurveyListWrapper__row__item third'}>
          <span>{t('common.remarks')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item forth'} />
      </div>
      {(items || []).map((option: questionValueType, index: number) => {
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
  questions: questionValueType[];
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
