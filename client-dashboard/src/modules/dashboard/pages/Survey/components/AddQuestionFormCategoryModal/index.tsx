import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Button, Input, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { IGetParams, IQuestion, IQuestionCategory } from '@/type';
import { useQuery } from 'react-query';
import { QuestionBankService } from '@/services';
import { onError, useDebounce } from '@/utils';
import { AddQuestionFormCategoryModalWrapper } from './style';
import { DisplayQuestionList } from './DisplayQuestionList/DisplayQuestionList';
import { useTranslation } from 'react-i18next';
import HannahCustomSpin from '@components/HannahCustomSpin';
import { useField } from 'formik';
import _get from 'lodash/get';
import SimpleBar from 'simplebar-react';
import { questionValueType } from '@pages/Survey/SurveyForm/type';
import { PlusOutLinedIcon } from '@/icons';
import { useSurveyFormContext } from '@pages/Survey';

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
  const { setSurveyFormContext } = useSurveyFormContext();

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
      'getAllQuestionByCategoryIdList',
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
    {
      onError,
      enabled: !!selectedCategoryIds && open,
      refetchOnWindowFocus: false,
    },
  );

  const questions = useMemo<IQuestion[]>(
    () => _get(getQuestionByCategoryIdListQuery.data, 'data.data', []),
    [getQuestionByCategoryIdListQuery.data],
  );

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

    let newValues: questionValueType[] = [];

    setSurveyFormContext(oldState => {
      const questionVersionIdMap = {
        ...oldState.question.questionVersionIdMap,
      };

      selectedQuestionIdList.forEach(chosenQuestionVersionId => {
        const question = questions.find(
          (q: IQuestion) =>
            q.latestCompletedVersion.id === chosenQuestionVersionId,
        ) as IQuestion;

        if (
          value.some(
            q => q?.questionVersionId === chosenQuestionVersionId, // check if chosen version is in the same question but different version
          )
        ) {
          return;
        }

        //collect selected questions to survey context
        if (!questionVersionIdMap[chosenQuestionVersionId]) {
          questionVersionIdMap[chosenQuestionVersionId] = {
            ...question.latestCompletedVersion,
            masterCategory: question.masterCategory,
          };
        }

        const transformData: questionValueType = {
          type: question.latestCompletedVersion.type,
          questionVersionId: chosenQuestionVersionId,
          category: question.masterCategory?.name as string,
          remarks: [],
          sort,
          id: question.id,
          questionTitle: question.latestCompletedVersion.title,
        };
        sort += 1;

        newValues = [...newValues, transformData];
      });
      return {
        ...oldState,
        question: {
          ...oldState.question,
          questionVersionIdMap,
        },
      };
    });

    setValue([...value, ...newValues]);
    onCancel();
  }, [
    onCancel,
    questions,
    selectedQuestionIdList,
    setSurveyFormContext,
    setValue,
    value,
  ]);

  return (
    <AddQuestionFormCategoryModalWrapper
      open={open}
      onCancel={onCloseModal}
      width={650}
      footer={
        <Button
          icon={<PlusOutLinedIcon />}
          className={'info-btn'}
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
      title={t('common.addWholeCategory')}
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
