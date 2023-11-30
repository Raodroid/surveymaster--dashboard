import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { IOptionItem, IQuestionVersion } from '@/type';
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

  const allOptions = useMemo<
    Array<IOptionItem & { questionVersion: IQuestionVersion }>
  >(() => {
    const result: Array<IOptionItem & { questionVersion: IQuestionVersion }> =
      [];
    questionListState.questions.forEach(q => {
      result.push({
        label: (
          <div>
            <span className={'text-textColor text-[12px]'}>
              {q.latestCompletedVersion.title as string}
            </span>
            <div className={'flex items-center gap-3 mt-1 mb-2'}>
              <span
                className={
                  'rounded-md border border-solid px-1.5 py-1 text-[12px] bg-[#0000000d]'
                }
              >
                {q.masterCategory?.name}
              </span>
              <span
                className={
                  'rounded-md border border-solid px-1.5 py-1 text-[12px] bg-[#0000000d]'
                }
              >
                {t(`questionType.${q.latestCompletedVersion.type}`)}
              </span>
            </div>
          </div>
        ),
        value: q.latestCompletedVersion.id as string,
        questionVersion: q.latestCompletedVersion,
      });
    });
    return result;
  }, [questionListState.questions, t]);

  const options = useMemo(() => {
    const displayVersionIds: string[] = [];
    const displayOptions = allOptions.reduce(
      (result: IOptionItem[], option) => {
        if (
          option.questionVersion.title.toLowerCase().includes(searchDebounce)
        ) {
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
