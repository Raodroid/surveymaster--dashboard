import React, { FC, useCallback, useMemo } from 'react';
import { IOptionItem, IQuestion } from '@/type';
import { Input } from 'antd';
import Checkbox from 'antd/lib/checkbox';
import { DisplayQuestionListWrapper } from './style';
import { useTranslation } from 'react-i18next';

interface IDisplayQuestionList {
  selectedQuestionIdList: string[];
  setSelectedQuestionIdList: (e?: any) => void;
  questions: IQuestion[];
  searchQuestionTxt: string;
  setSearchQuestionTxt: (value: string) => void;
}

export const DisplayQuestionList: FC<IDisplayQuestionList> = props => {
  const {
    selectedQuestionIdList,
    setSelectedQuestionIdList,
    questions,
    searchQuestionTxt,
    setSearchQuestionTxt,
  } = props;
  const { t } = useTranslation();
  const isSelectAll = selectedQuestionIdList.length === questions.length;

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
  }, [questions, setSelectedQuestionIdList]);

  const onChange = useCallback(
    values => {
      setSelectedQuestionIdList(values);
    },
    [setSelectedQuestionIdList],
  );

  const handleTyping = useCallback(
    e => {
      setSearchQuestionTxt(e.target.value);
    },
    [setSearchQuestionTxt],
  );

  const selectAll = useCallback(() => {
    const listQuestionIds = questions.map(
      item => item.latestCompletedVersion.id,
    );
    const newSelectedQuestionIds =
      selectedQuestionIdList.length === listQuestionIds.length
        ? []
        : listQuestionIds;
    setSelectedQuestionIdList(newSelectedQuestionIds);
  }, [questions, selectedQuestionIdList, setSelectedQuestionIdList]);

  return (
    <DisplayQuestionListWrapper>
      <label className={'label-input'}>{t('common.selectQuestion')}</label>
      <Input
        className={'search-input'}
        allowClear
        placeholder={`${t('common.searchQuestion')}...`}
        value={searchQuestionTxt}
        onChange={handleTyping}
      />
      <Checkbox checked={isSelectAll} onChange={selectAll}>
        {t('common.selectAll')}
      </Checkbox>
      <div className="line" />
      <Checkbox.Group
        value={selectedQuestionIdList}
        options={options}
        onChange={onChange}
      />
    </DisplayQuestionListWrapper>
  );
};
