import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Button, Input, MenuProps } from 'antd';
import {
  IGetParams,
  IQuestion,
  IQuestionCategory,
  ISurveyQuestionDto,
  QuestionType,
} from 'type';
import { useQuery } from 'react-query';
import { QuestionBankService } from 'services';
import { useDebounce, onError } from 'utils';
import {
  AddQuestionFormCategoryModalWrapper,
  CategoryMenuWrapper,
} from './style';
import { DisplayQuestionList } from './DisplayQuestionList/DisplayQuestionList';
import { useTranslation } from 'react-i18next';
import HannahCustomSpin from '../../../../../../../components/HannahCustomSpin';
import { useFormikContext } from 'formik';
import { IAddSurveyFormValues } from '../SurveyForm';
import _get from 'lodash/get';
import SimpleBar from 'simplebar-react';

const initParams = {
  take: 10,
  page: 1,
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

interface IAddQuestionFormCategoryModal {
  open: boolean;
  onCancel: () => void;
}

const AddQuestionFormCategoryModal: FC<
  IAddQuestionFormCategoryModal
> = props => {
  const { open, onCancel } = props;
  const [searchTxt, setSearchTxt] = useState<string>('');
  const [searchQuestionTxt, setSearchQuestionTxt] = useState<string>('');

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedQuestionIdList, setSelectedQuestionIdList] = useState<
    string[]
  >([]);
  const { setFieldValue, values } = useFormikContext<IAddSurveyFormValues>();

  const wrapperRef = useRef<any>();

  const { t } = useTranslation();

  const debounceSearchText = useDebounce(searchTxt);

  const currentParam = useMemo<IGetParams>(
    () => ({
      ...initParams,
      selectAll: true,
      q: debounceSearchText,
    }),
    [debounceSearchText],
  );

  const getCategoryListQuery = useQuery(
    ['getCategoryList', currentParam],
    () => {
      return QuestionBankService.getCategories(currentParam);
    },
    { onError, enabled: open, refetchOnWindowFocus: false },
  );

  const categoryData = useMemo(() => {
    if (!getCategoryListQuery.data) return [];
    return getCategoryListQuery.data.data.data.reduce(
      (current: MenuItem[], category: IQuestionCategory) => {
        return [...current, getItem(category.name, category.id)];
      },
      [],
    );
  }, [getCategoryListQuery.data]);

  const debounceSearchTextQuestion = useDebounce(searchQuestionTxt);

  const getQuestionByCategoryIdListQuery = useQuery(
    [
      'getQuestionByCategoryIdList',
      selectedCategoryId,
      debounceSearchTextQuestion,
    ],
    () => {
      return QuestionBankService.getQuestions({
        categoryIds: [selectedCategoryId],
        q: debounceSearchTextQuestion,
        hasLatestCompletedVersion: true,
      });
    },
    { onError, enabled: !!selectedCategoryId, refetchOnWindowFocus: false },
  );

  const questions = useMemo<IQuestion[]>(
    () => _get(getQuestionByCategoryIdListQuery.data, 'data.data', []),
    [getQuestionByCategoryIdListQuery.data],
  );

  const handleTyping = useCallback(
    e => {
      setSearchTxt(e.target.value);
      setSelectedCategoryId('');
    },
    [setSearchTxt],
  );
  const handleSelect = useCallback(({ key }) => {
    setSelectedCategoryId(key);
  }, []);

  const onCloseModal = useCallback(() => {
    onCancel();
    setSelectedCategoryId('');
  }, [onCancel]);

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
    onCancel();
  }, [
    onCancel,
    questions,
    selectedQuestionIdList,
    setFieldValue,
    values.questions,
  ]);

  return (
    <AddQuestionFormCategoryModalWrapper
      open={open}
      onCancel={onCloseModal}
      width={650}
      footer={
        <Button
          type={'primary'}
          disabled={!selectedQuestionIdList.length}
          onClick={handleAddQuestions}
          loading={getQuestionByCategoryIdListQuery.isLoading}
        >
          {t('common.add')} {selectedQuestionIdList.length}{' '}
          {t(
            `common.${
              selectedQuestionIdList.length === 1 ? 'question' : 'questions'
            }`,
          )}
        </Button>
      }
      centered
      title={t('common.addAllQuestionsFromOneCategory')}
    >
      <SimpleBar>
        <div className={'AddQuestionFormCategoryModal_body'}>
          <div className={'category-column'} ref={wrapperRef}>
            <HannahCustomSpin
              parentRef={wrapperRef}
              spinning={getCategoryListQuery.isLoading}
            />
            <label className={'label-input'}>
              {t('common.selectCategory')}
            </label>
            <Input
              className={'search-input'}
              allowClear
              placeholder={`${t('common.searchCategory')}...`}
              value={searchTxt}
              onChange={handleTyping}
            />
            <CategoryMenuWrapper items={categoryData} onSelect={handleSelect} />
          </div>
          {selectedCategoryId && (
            <DisplayQuestionList
              selectedCategoryId={selectedCategoryId}
              selectedQuestionIdList={selectedQuestionIdList}
              setSelectedQuestionIdList={setSelectedQuestionIdList}
              questions={questions}
              searchQuestionTxt={searchQuestionTxt}
              setSearchQuestionTxt={setSearchQuestionTxt}
            />
          )}
        </div>
      </SimpleBar>
    </AddQuestionFormCategoryModalWrapper>
  );
};

export default AddQuestionFormCategoryModal;
