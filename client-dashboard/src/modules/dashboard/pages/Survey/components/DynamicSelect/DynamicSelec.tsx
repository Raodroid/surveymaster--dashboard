import React, { FC, useCallback, useMemo } from 'react';
import { useSurveyFormContext } from '@pages/Survey/components/SurveyFormContext/SurveyFormContext';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { questionValueType } from '@pages/Survey/SurveyForm/type';
import { IOptionItem } from '@/type';
import { Badge } from 'antd';
import moment from 'moment';
import { MOMENT_FORMAT } from '@/enums';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import _get from 'lodash/get';

interface IDynamicSelectQuestion {
  setSearchTxt: (input: string) => void;
  fieldName: string;
  className?: string;
  availableQuestionOptions: IOptionItem[];
  parentFieldName: string;
}

const DynamicSelect: FC<IDynamicSelectQuestion> = props => {
  const {
    setSearchTxt,
    fieldName,
    className,
    parentFieldName,
    availableQuestionOptions,
  } = props;

  const { question, form } = useSurveyFormContext();
  const {
    questionIdMap,
    hasNextQuestionPage,
    fetchNextQuestionPage,
    isFetchingQuestion,
  } = question;

  const { initialValues } = form;

  const { t } = useTranslation();
  const [{ value }, , { setValue }] = useField<questionValueType>(fieldName);

  const currQuestionVersionId = value.questionVersionId;
  const currQuestionVersionCreatedAt = value.createdAt;

  const options = useMemo<IOptionItem[]>(() => {
    const currQuestionVersionId = value?.questionVersionId;

    if (currQuestionVersionId) {
      return [
        ...availableQuestionOptions,
        {
          label: value.questionTitle,
          value: currQuestionVersionId,
        },
      ];
    }
    return availableQuestionOptions;
  }, [availableQuestionOptions, value]);

  const fetch = useCallback(
    async target => {
      target.scrollTo(0, target.scrollHeight);

      if (hasNextQuestionPage) {
        await fetchNextQuestionPage();
      }
    },
    [fetchNextQuestionPage, hasNextQuestionPage],
  );
  const onScroll = useCallback(
    async event => {
      let target = event.target;
      if (
        !isFetchingQuestion &&
        target.scrollTop + target.offsetHeight === target.scrollHeight
      ) {
        await fetch(target);
      }
    },
    [fetch, isFetchingQuestion],
  );

  const handleOnChange = useCallback(
    questionId => {
      const chooseQuestion = questionIdMap[questionId];

      if (chooseQuestion) {
        setValue({
          ...value,
          category: chooseQuestion.masterCategory?.name as string,
          type: chooseQuestion.latestCompletedVersion.type as string,
          questionTitle: chooseQuestion.latestCompletedVersion.title as string,
          id: chooseQuestion.latestCompletedVersion.questionId,
          questionVersionId: chooseQuestion.latestCompletedVersion.id as string,
          versions: chooseQuestion.versions,
          createdAt: chooseQuestion.createdAt,
        });

        setSearchTxt('');
      }
    },
    [questionIdMap, setValue, value, setSearchTxt],
  );

  const isNewQuestion = useMemo(() => {
    if (!currQuestionVersionId) return true;

    const currBlockQuestions: questionValueType[] = _get(
      initialValues,
      parentFieldName,
    );

    return !currBlockQuestions.some(
      opt =>
        opt.questionVersionId === currQuestionVersionId ||
        opt.versions?.some(ver => ver?.id === currQuestionVersionId),
    );
  }, [currQuestionVersionId, initialValues, parentFieldName]);

  const onBlur = useCallback(() => {
    setSearchTxt('');
  }, [setSearchTxt]);

  return (
    <div className={'question-cell'}>
      {!isNewQuestion && (
        <>
          <Badge status={'success'} />{' '}
          <span style={{ fontSize: 12, fontWeight: 600, lineHeight: '2rem' }}>
            {moment(currQuestionVersionCreatedAt).format(
              MOMENT_FORMAT.FULL_DATE_FORMAT,
            )}
          </span>
        </>
      )}
      {!isNewQuestion ? (
        <ControlledInput
          inputType={INPUT_TYPES.INPUT}
          style={{ width: '100%' }}
          placeholder={t('common.selectQuestion')}
          disabled
          name={`${fieldName}.questionTitle`}
          className={className}
          onBlur={onBlur}
        />
      ) : (
        <ControlledInput
          notFoundContent={
            isFetchingQuestion ? <div>Loading... </div> : undefined
          }
          onBlur={onBlur}
          inputType={INPUT_TYPES.SELECT}
          style={{ width: '100%' }}
          onPopupScroll={onScroll}
          onSearch={value => {
            setSearchTxt(value);
          }}
          filterOption={false}
          showSearch
          options={options}
          placeholder={t('common.selectQuestion')}
          onChange={handleOnChange}
          name={`${fieldName}.questionVersionId`}
          className={className}
        />
      )}
    </div>
  );
};

export default DynamicSelect;
