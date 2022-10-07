import React, {
  createContext,
  Dispatch,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { GetListQuestionDto, IQuestion, QuestionType } from 'type';
import { useTranslation } from 'react-i18next';
import { DisplayQuestionSurveyListWrapper } from './style';
import { FieldArray, useFormikContext } from 'formik';
import { Button } from 'antd';
import DragQuestionSurveyList from './DragQuestionSurveyList';
import { IAddSurveyFormValues } from '../AddSurveyForm';
import { useInfiniteQuery } from 'react-query';
import { onError, useDebounce } from 'utils';
import { QuestionBankService } from 'services';

interface IDisplayAnswerList {
  mode?: 'view' | 'edit';
}

const initParams: GetListQuestionDto = {
  q: '',
  take: 2,
  page: 1,
  // isDeleted: BooleanEnum.FALSE,
};

interface IDisplayQuestionSurveyListContext {
  questions: IQuestion[];
  isLoading: boolean;
  searchTxt: string;
  setSearchTxt: Dispatch<string>;
  lastElementRef: (node: any) => void;
}

const DisplayQuestionSurveyListContext =
  createContext<IDisplayQuestionSurveyListContext | null>(null);

const DisplayQuestionSurveyList: FC<IDisplayAnswerList> = props => {
  const { mode = 'edit' } = props;
  const { values } = useFormikContext<IAddSurveyFormValues>();
  const { t } = useTranslation();

  const [searchTxt, setSearchTxt] = useState<string>('');

  const debounceSearchText = useDebounce(searchTxt);

  const currentParam = useMemo<GetListQuestionDto>(
    () => ({
      ...initParams,
      q: debounceSearchText,
      nextToken: undefined,
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
          ? { ...currentParam, nextToken: lastPage.data.nextToken }
          : false;
      },
      onError,
    },
  );

  const questionList = useMemo<IQuestion[]>(() => {
    if (!data) return [];
    let rs: IQuestion[] = [];
    return data.pages.reduce((current, page) => {
      rs = [...current, ...page.data.data];
      return rs;
    }, rs);
  }, [data]);

  const [inView, setInView] = useState(true);

  const lastElementRef = useCallback(
    node => {
      if (node) {
        const obs = new IntersectionObserver(
          entities => {
            const result = entities.some(entry => {
              return entry.isIntersecting;
            });
            setInView(result);
          },
          {
            threshold: [0, 1],
          },
        );
        obs.observe(node);
      }
    },
    [setInView],
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage().then();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  return (
    <DisplayQuestionSurveyListContext.Provider
      value={{
        questions: questionList,
        isLoading,
        searchTxt,
        setSearchTxt,
        lastElementRef,
      }}
    >
      <DisplayQuestionSurveyListWrapper
        className={'DisplayQuestionSurveyListWrapper'}
      >
        <FieldArray
          name="questions"
          render={arrayHelpers => (
            <>
              <DragQuestionSurveyList
                questions={values.questions}
                arrayHelpers={arrayHelpers}
              />
              {mode === 'edit' && (
                <div className="QuestionListWrapper__footer flex">
                  <Button>{t('common.addAllQuestionsFromOneCategory')}</Button>
                  <Button
                    type="primary"
                    onClick={() =>
                      arrayHelpers.push({
                        title: '',
                        questionVersionId: '',
                        remark: '',
                        id: Math.random(),
                        type: QuestionType.TEXT_ENTRY,
                        categoryName: '',
                      })
                    }
                  >
                    {t('common.addOneMoreQuestion')}
                  </Button>
                </div>
              )}
            </>
          )}
        />
      </DisplayQuestionSurveyListWrapper>
    </DisplayQuestionSurveyListContext.Provider>
  );
};

export default memo(DisplayQuestionSurveyList);
