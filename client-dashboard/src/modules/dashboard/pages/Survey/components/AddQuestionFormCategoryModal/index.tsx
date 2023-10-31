import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Button, Input, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { IGetParams, IQuestion, IQuestionCategory } from '@/type';
import { useQuery } from 'react-query';
import { QuestionBankService } from '@/services';
import { useDebounce, onError } from '@/utils';
import { AddQuestionFormCategoryModalWrapper } from './style';
import { DisplayQuestionList } from './DisplayQuestionList/DisplayQuestionList';
import { useTranslation } from 'react-i18next';
import HannahCustomSpin from '@components/HannahCustomSpin';
import { useField } from 'formik';
import _get from 'lodash/get';
import SimpleBar from 'simplebar-react';
import { questionValueType } from '@pages/Survey/SurveyForm/type';

interface IAddQuestionFormCategoryModal {
  open: boolean;
  onCancel: () => void;
  fieldName: string;
}

const AddQuestionFormCategoryModal: FC<
  IAddQuestionFormCategoryModal
> = props => {
  const { open, onCancel, fieldName } = props;
  const [searchTxt, setSearchTxt] = useState<string>('');
  const [searchQuestionTxt, setSearchQuestionTxt] = useState<string>('');

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedQuestionIdList, setSelectedQuestionIdList] = useState<
    string[]
  >([]);

  const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);

  const wrapperRef = useRef<any>();

  const { t } = useTranslation();

  const debounceSearchText = useDebounce(searchTxt);

  const currentParam = useMemo<IGetParams>(
    () => ({
      selectAll: true,
      q: debounceSearchText,
    }),
    [debounceSearchText],
  );

  const onCheck = (checkedKeys: string[]) => {
    setSelectedCategoryIds(checkedKeys);
    if (!checkedKeys.length) setSelectedQuestionIdList([]);
  };

  const { data, isLoading, isFetching } = useQuery(
    ['getCategoryList', currentParam],
    () => {
      return QuestionBankService.getCategories(currentParam);
    },
    { onError, enabled: open, refetchOnWindowFocus: false },
  );

  const categoryTreeData = useMemo(() => {
    if (!data) return [];
    return data.data.data.reduce(
      (prevArr: DataNode[], category: IQuestionCategory) => {
        const { id: parentKey, name: parentTitle, children = [] } = category;
        const childrenTree = children.map(item => ({
          key: `${item.id}`,
          title: item.name,
        }));
        return [
          ...prevArr,
          {
            key: `${parentKey}`,
            title: parentTitle,
            children: childrenTree,
          },
        ];
      },
      [],
    );
  }, [data]);

  const debounceSearchTextQuestion = useDebounce(searchQuestionTxt);

  const getQuestionByCategoryIdListQuery = useQuery(
    [
      'getQuestionByCategoryIdList',
      selectedCategoryIds,
      debounceSearchTextQuestion,
    ],
    () => {
      return QuestionBankService.getQuestions({
        body: { subCategoryIds: selectedCategoryIds },
        q: debounceSearchTextQuestion,
        hasLatestCompletedVersion: true,
        isDeleted: false,
        selectAll: true,
      });
    },
    { onError, enabled: !!selectedCategoryIds, refetchOnWindowFocus: false },
  );

  const questions = useMemo<IQuestion[]>(
    () => _get(getQuestionByCategoryIdListQuery.data, 'data.data', []),
    [getQuestionByCategoryIdListQuery.data],
  );
  // console.log('\n ==> questions', questions);

  const handleTyping = useCallback(
    e => {
      setSearchTxt(e.target.value);
      setSelectedCategoryIds([]);
    },
    [setSearchTxt],
  );

  const onCloseModal = useCallback(() => {
    onCancel();
    setSelectedCategoryIds([]);
  }, [onCancel]);

  const handleAddQuestions = useCallback(async () => {
    let sort = value.length + 1;
    const newValues: questionValueType[] = selectedQuestionIdList.reduce(
      (result: questionValueType[], chosenQuestionVersionId) => {
        const question = questions.find(
          (q: IQuestion) =>
            q.latestCompletedVersion.id === chosenQuestionVersionId,
        ) as IQuestion;

        if (
          value.some(
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
    setValue([...value, ...newValues]);
    onCancel();
  }, [onCancel, questions, selectedQuestionIdList, setValue, value]);

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
              selectedQuestionIdList.length === 1 ||
              !selectedQuestionIdList.length
                ? 'question'
                : 'questions'
            }`,
          )}
        </Button>
      }
      centered
      title={t('common.addAllQuestionsFromOneCategory')}
    >
      <div className={'AddQuestionFormCategoryModal_body'}>
        <SimpleBar>
          <div className={'category-column'} ref={wrapperRef}>
            <HannahCustomSpin
              parentRef={wrapperRef}
              spinning={isLoading || isFetching}
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
            {/* <CategoryMenuWrapper items={categoryData} onSelect={handleSelect} /> */}
            <Tree
              checkable
              onCheck={onCheck as any}
              checkedKeys={selectedCategoryIds}
              treeData={categoryTreeData}
            />
          </div>
        </SimpleBar>
        {!!selectedCategoryIds.length && (
          <>
            <span className={'border'} style={{ borderRight: 0 }} />
            <SimpleBar>
              <DisplayQuestionList
                selectedQuestionIdList={selectedQuestionIdList}
                setSelectedQuestionIdList={setSelectedQuestionIdList}
                questions={questions}
                searchQuestionTxt={searchQuestionTxt}
                setSearchQuestionTxt={setSearchQuestionTxt}
              />
            </SimpleBar>
          </>
        )}
      </div>
    </AddQuestionFormCategoryModalWrapper>
  );
};

export default AddQuestionFormCategoryModal;
