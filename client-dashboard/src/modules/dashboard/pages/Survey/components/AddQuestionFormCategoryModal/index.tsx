import React, { FC, useCallback, useMemo, useState } from 'react';
import { Button, Input, Spin } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { IGetParams, IQuestion, IQuestionCategory } from '@/type';
import { useQuery } from 'react-query';
import { QuestionBankService } from '@/services';
import { onError, useDebounce } from '@/utils';
import { AddQuestionFormCategoryModalWrapper, TreeWrapper } from './style';
import { DisplayQuestionList } from './DisplayQuestionList/DisplayQuestionList';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import _get from 'lodash/get';
import SimpleBar from 'simplebar-react';
import { questionValueType } from '@pages/Survey/SurveyForm/type';
import { PlusOutLinedIcon } from '@/icons';
import { useSurveyFormContext } from '@pages/Survey';

export interface questionListState {
  selectedVersionIds: string[];
  displayVersionIds: string[];
  questions: IQuestion[];
}

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
  const { setSurveyFormContext } = useSurveyFormContext();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [questionListState, setQuestionListState] = useState<questionListState>(
    {
      selectedVersionIds: [],
      displayVersionIds: [],
      questions: [],
    },
  );

  const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);

  const { t } = useTranslation();

  const debounceSearchText = useDebounce(searchTxt);

  const currentParam = useMemo<IGetParams>(
    () => ({
      selectAll: true,
      q: debounceSearchText,
    }),
    [debounceSearchText],
  );

  const onCheck = useCallback(
    (
      checkedKeys: string[],
      info: {
        checked: boolean;
        node: {
          key: string;
          pos: string;
          children?: { key: string }[];
        };
      },
    ) => {
      const { checked, node } = info;
      const { key, children } = node;

      if (checked) {
        setSelectedCategoryIds(s => [...new Set([...s, ...checkedKeys])]);
      } else {
        const keyEntities: Record<
          string,
          {
            key: string;
            pos: string;
            parent: { key: string; children: { key: string }[] };
          }
        > = _get(info, 'node.props.context.keyEntities');
        const currentNode = keyEntities[node.key];
        const parent = currentNode.parent;
        const initValue: string[] = [key];
        if (parent) {
          initValue.push(parent.key);
        }
        const allFilterKey = (children || []).reduce((res, child) => {
          return [...res, child.key];
        }, initValue);

        setSelectedCategoryIds(s => s.filter(i => !allFilterKey.includes(i)));
      }
      if (!checkedKeys.length)
        setQuestionListState(s => ({ ...s, selectedVersionIds: [] }));
    },
    [],
  );

  const { data, isLoading } = useQuery(
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

  const getQuestionByCategoryIdListQuery = useQuery(
    ['getAllQuestionByCategoryIdList', selectedCategoryIds],
    () => {
      return QuestionBankService.getQuestions({
        body: { subCategoryIds: selectedCategoryIds },
        hasLatestCompletedVersion: true,
        isDeleted: false,
        selectAll: true,
      });
    },
    {
      onSuccess: res => {
        const questions: IQuestion[] = res.data.data;
        setQuestionListState(s => ({
          ...s,
          questions,
          selectedVersionIds: s.selectedVersionIds.reduce(
            (res: string[], id) => {
              if (questions.some(i => i.latestCompletedVersion.id === id)) {
                return [...res, id];
              }
              return res;
            },
            [],
          ),
        }));
      },
      onError,
      enabled: selectedCategoryIds.length !== 0 && open,
      refetchOnWindowFocus: false,
    },
  );

  const handleTyping = useCallback(
    e => {
      setSearchTxt(e.target.value);
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

      questionListState.selectedVersionIds.forEach(chosenQuestionVersionId => {
        const question = questionListState.questions.find(
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
    questionListState.questions,
    questionListState.selectedVersionIds,
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
          disabled={!questionListState.selectedVersionIds.length}
          onClick={handleAddQuestions}
          loading={getQuestionByCategoryIdListQuery.isLoading}
        >
          {t('common.add')} {questionListState.selectedVersionIds.length}{' '}
          {t(
            `common.${
              questionListState.selectedVersionIds.length === 1 ||
              !questionListState.selectedVersionIds.length
                ? 'question'
                : 'questions'
            }`,
          )}
        </Button>
      }
      centered
      title={t('common.addWholeCategory')}
    >
      <Spin spinning={isLoading || getQuestionByCategoryIdListQuery.isLoading}>
        <div className={'AddQuestionFormCategoryModal_body'}>
          <SimpleBar>
            <div className={'category-column'}>
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
              <TreeWrapper
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
                  questionListState={questionListState}
                  setQuestionListState={setQuestionListState}
                />
              </SimpleBar>
            </>
          )}
        </div>
      </Spin>
    </AddQuestionFormCategoryModalWrapper>
  );
};

export default AddQuestionFormCategoryModal;
