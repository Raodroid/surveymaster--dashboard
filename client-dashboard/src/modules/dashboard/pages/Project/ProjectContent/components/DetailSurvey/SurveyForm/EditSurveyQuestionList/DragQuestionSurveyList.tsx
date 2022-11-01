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
import { MenuDropDownWrapper } from '../../../../../../../../../customize-components/styles';

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
  isLoading: boolean;
  fetchNextPage: any;
  hasNextPage?: boolean;
  setSearchTxt: (value: string) => void;
  questionOption: IOptionItem[];
  normalizeByQuestionId: Record<string, IQuestion>;
}> = props => {
  const {
    opt,
    index,
    arrayHelpers,
    isLoading,
    fetchNextPage,
    hasNextPage,
    setSearchTxt,
    questionOption,
    normalizeByQuestionId,
  } = props;
  const { t } = useTranslation();
  const { setValues, initialValues, getFieldMeta } =
    useFormikContext<IAddSurveyFormValues>();

  const { value } = getFieldMeta<questionValueType>(`questions[${index}]`);

  const isDirty =
    initialValues.questionIdMap &&
    !Object.keys(initialValues.questionIdMap).some(
      questionVersionId => questionVersionId === value.questionVersionId, // check if the value was existed in survey
    );

  const options = useMemo<IOptionItem[]>(() => {
    const currQuestionVersionId = value.questionVersionId;
    if (currQuestionVersionId) {
      return [
        ...questionOption,
        {
          label: value.questionTitle,
          value: currQuestionVersionId,
        },
      ];
    }
    return [...questionOption];
  }, [questionOption, value]);

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
        setValues(v => ({
          ...v,
          questions: v.questions.map((q, idx) => {
            if (idx === index) {
              return {
                ...q,
                category: chooseQuestion.masterCategory?.name as string,
                type: chooseQuestion.latestCompletedVersion.type as string,
                questionTitle: chooseQuestion.latestCompletedVersion
                  .title as string,
                id: chooseQuestion.latestCompletedVersion.questionId,
              };
            }
            return q;
          }),
        }));
        setSearchTxt('');
      }
    },
    [index, normalizeByQuestionId, setValues, setSearchTxt],
  );

  const [newVersions, historyVersions] = useMemo<
    [IQuestionVersion[] | undefined, IQuestionVersion[] | undefined]
  >(() => {
    const versions = value.versions;

    if (!versions) return [undefined, undefined];

    const newVersions: IQuestionVersion[] = [];
    const historyVersions: IQuestionVersion[] = [];

    let chosenValueIdx: undefined | number = undefined;

    versions?.forEach((ver, idx) => {
      const isCurrentValue = ver.id === value.questionVersionId;

      if (ver.deletedAt && !isCurrentValue) {
        return;
      }

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
  }, [value.questionVersionId, value.versions]);

  const [show, setShow] = useState(false);

  const hasTopContent = !!newVersions;

  const renderContent = (
    <>
      <div className={'DisplayQuestionSurveyListWrapper__row__item first'}>
        <DragIcon />
        <span> {index + 1}</span>
      </div>

      <div
        className={`DisplayQuestionSurveyListWrapper__row__item second ${
          hasTopContent ? 'marginTop' : ''
        }`}
      >
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
                options={options}
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
              const isCurrentValue = ver.id === value.questionVersionId;

              return isCurrentValue ? (
                <div className={'question-info-wrapper'} key={ver.id}>
                  <div className={'question'}>
                    <div className={'question-label-info'}>
                      <span className={'status-question success-color'} />{' '}
                      <span>
                        {moment(ver.createdAt).format(
                          MOMENT_FORMAT.FULL_DATE_FORMAT,
                        )}
                      </span>
                      {isDirty && idx === 0 && (
                        <span
                          className={'decline-change-btn'}
                          onClick={() => {
                            const questionIdMap = initialValues.questionIdMap;

                            setValues(values => ({
                              ...values,
                              questions: !questionIdMap
                                ? values.questions
                                : values.questions.map(q => {
                                    if (
                                      q.questionVersionId !== //only care about the current value
                                      value.questionVersionId
                                    )
                                      return q;

                                    if (questionIdMap[q.questionVersionId])
                                      //if true => nothing change here
                                      return q;

                                    const key = Object.keys(questionIdMap).find(
                                      questionVersionId => {
                                        return questionIdMap[
                                          questionVersionId
                                        ].versions.some(v => ver.id === v.id);
                                      },
                                    );

                                    if (key) {
                                      return {
                                        ...q,
                                        questionVersionId: key as string,
                                        questionTitle:
                                          questionIdMap[key].questionTitle,
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
                      inputType={INPUT_TYPES.INPUT}
                      name={`questions[${index}].questionTitle`}
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
                        {moment(ver.createdAt).format(
                          MOMENT_FORMAT.FULL_DATE_FORMAT,
                        )}
                      </span>
                    </div>
                    <UncontrollInput
                      disabled
                      inputType={INPUT_TYPES.INPUT}
                      name={`questions[${index}].questionTitle`}
                      value={ver.title}
                    />
                  </div>

                  <div className={'category'}>
                    <ControlledInput
                      disabled
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
                        name={`questions[${index}].questionTitle`}
                        value={ver.title}
                      />
                    </div>

                    <div className={'category'}>
                      <ControlledInput
                        disabled
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

      <div
        className={`DisplayQuestionSurveyListWrapper__row__item third ${
          hasTopContent ? 'marginTop' : ''
        }`}
      >
        <ControlledInput
          inputType={INPUT_TYPES.TEXTAREA}
          rows={hasTopContent ? 3 : 1}
          name={`questions[${index}].remark`}
        />
      </div>

      <div
        className={`DisplayQuestionSurveyListWrapper__row__item forth ${
          hasTopContent ? 'marginTop' : ''
        }`}
      >
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
              <MenuDropDownWrapper>
                <Menu.Item
                  key={ACTION_ENUM.DELETE}
                  onClick={() => {
                    arrayHelpers.remove(index);
                    if (arrayHelpers.form?.[arrayHelpers.name]?.length === 0) {
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
              </MenuDropDownWrapper>
            }
            trigger={['click']}
          />
        )}
      </div>
    </>
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
          {renderContent}
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
  const { values } = useFormikContext<IAddSurveyFormValues>();

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

  const [questionOption, normalizeByQuestionId] = useMemo<
    [IOptionItem[], Record<string, IQuestion>]
  >(() => {
    if (!data) return [[], {}];

    const normalizeByQuestionId: Record<string, IQuestion> = {};
    return [
      data.pages.reduce((current: IOptionItem[], page) => {
        const nextPageData = page.data.data;
        nextPageData.forEach((q: IQuestion) => {
          const latestQuestionVersionId = q.latestCompletedVersion.id;
          const latestQuestionId = q.id;
          if (
            values.questions.some(
              q => q.id === latestQuestionId, // check if chosen version is in the same question but different version
            )
          ) {
            return current;
          }

          normalizeByQuestionId[latestQuestionVersionId as string] = q;

          current.push({
            label: q?.latestCompletedVersion?.title,
            value: latestQuestionVersionId as string,
          });
        });
        return current;
      }, []),
      normalizeByQuestionId,
    ];
  }, [data, values]);

  return (
    <>
      <div className={'DisplayQuestionSurveyListWrapper__row title-column'}>
        <div className={'DisplayQuestionSurveyListWrapper__row__item first'}>
          <span>{t('common.order')}</span>
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
            key={option.id}
            arrayHelpers={arrayHelpers}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            setSearchTxt={setSearchTxt}
            questionOption={questionOption}
            normalizeByQuestionId={normalizeByQuestionId}
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
