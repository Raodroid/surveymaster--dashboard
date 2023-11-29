import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { IOptionItem } from '@/type';
import { Input } from 'antd';
import Checkbox from 'antd/lib/checkbox';
import { DisplayQuestionListWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/utils';
import { questionListState } from '..';

interface IDisplayQuestionList {
  setQuestionListState: Dispatch<SetStateAction<questionListState>>;
  questionListState: questionListState;
}

export const DisplayQuestionList: FC<IDisplayQuestionList> = props => {
  const { setQuestionListState, questionListState } = props;
  const { t } = useTranslation();

  const isSelectAll = (() => {
    if (
      questionListState.selectedVersionIds.length === 0 ||
      questionListState.displayVersionIds.length === 0
    )
      return false;
    if (
      questionListState.displayVersionIds.length >
      questionListState.selectedVersionIds.length
    )
      return false;

    return !questionListState.displayVersionIds.some(
      i => !questionListState.selectedVersionIds.includes(i),
    );
  })();

  const [searchQuestionTxt, setSearchQuestionTxt] = useState<string>('');

  const searchDebounce = useDebounce(searchQuestionTxt.toLowerCase());
  const allOptions = useMemo<IOptionItem[]>(() => {
    const result: IOptionItem[] = [];
    questionListState.questions.forEach(q => {
      result.push({
        label: q.latestCompletedVersion.title as string,
        value: q.latestCompletedVersion.id as string,
      });
    });
    return result;
  }, [questionListState.questions]);

  const options = useMemo(() => {
    const displayVersionIds: string[] = [];
    const displayOptions = allOptions.reduce(
      (result: IOptionItem[], option) => {
        if (option.label.toLowerCase().includes(searchDebounce)) {
          displayVersionIds.push(option.value);
          return [...result, option];
        }
        return result;
      },
      [],
    );
    setQuestionListState(s => ({ ...s, displayVersionIds }));
    return displayOptions;
  }, [allOptions, searchDebounce, setQuestionListState]);

  const onChange = useCallback(
    newSelectedValues => {
      setQuestionListState(s => ({
        ...s,
        selectedVersionIds: s.selectedVersionIds.reduce(
          (res: string[], item) => {
            if (s.displayVersionIds.includes(item)) return res;
            return [...res, item];
          },
          newSelectedValues,
        ),
      }));
    },
    [setQuestionListState],
  );

  const handleTyping = useCallback(
    e => {
      setSearchQuestionTxt(e.target.value);
    },
    [setSearchQuestionTxt],
  );

  const handleSelectAll = useCallback(
    e => {
      if (e.target.checked) {
        setQuestionListState(s => ({
          ...s,
          selectedVersionIds: [
            ...new Set([...s.selectedVersionIds, ...s.displayVersionIds]),
          ],
        }));
      } else {
        setQuestionListState(s => ({
          ...s,
          selectedVersionIds: s.selectedVersionIds.filter(
            i => !s.displayVersionIds.includes(i),
          ),
        }));
      }
    },
    [setQuestionListState],
  );

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
      <Checkbox checked={isSelectAll} onChange={handleSelectAll}>
        {t('common.selectAll')}
      </Checkbox>
      <div className="line" />
      <Checkbox.Group
        value={questionListState.selectedVersionIds}
        options={options}
        onChange={onChange}
      />
    </DisplayQuestionListWrapper>
  );
};
