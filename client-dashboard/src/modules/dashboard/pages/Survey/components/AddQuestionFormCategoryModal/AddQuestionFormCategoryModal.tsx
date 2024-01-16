import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Button, Input, Spin } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { IQuestion, IQuestionCategory } from '@/type';
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

const defaultQuestionListState: questionListState = {
  selectedVersionIds: [],
  displayVersionIds: [],
  questions: [],
};
const AddQuestionFormCategoryModal: FC<
  IAddQuestionFormCategoryModal
> = props => {
  const { open, onCancel, fieldName } = props;
  const [searchTxt, setSearchTxt] = useState<string>('');
  const { setSurveyFormContext } = useSurveyFormContext();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const newSelectedCategoryIds = useRef<{
    keys: string[];
    action: null | 'checked' | 'unChecked';
  }>({ keys: [], action: null });

  const [questionListState, setQuestionListState] = useState<questionListState>(
    defaultQuestionListState,
  );

  const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);

  const { t } = useTranslation();

  const debounceSearchText = useDebounce(searchTxt);

  const currentParam = {
    selectAll: true,
    q: debounceSearchText,
  };

  const onCheck = useCallback(
    (
      checkedKeys: string[],
      info: {
        checkedNodes: Array<{
          key: string;
          title: string;
          children: Array<{ key: string; title: string }>;
        }>;
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
        newSelectedCategoryIds.current.action = 'checked';
        setSelectedCategoryIds(s => [...new Set([...s, ...checkedKeys])]);
        newSelectedCategoryIds.current.keys = [key];

        if (children) {
          children.forEach(child => {
            newSelectedCategoryIds.current.keys.push(child.key);
          });
        }
      } else {
        newSelectedCategoryIds.current.action = 'unChecked';
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
        newSelectedCategoryIds.current.keys =
          newSelectedCategoryIds.current.keys.filter(
            i => !allFilterKey.includes(i),
          );
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
    { onError, refetchOnWindowFocus: false },
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

        const newQuestionIds: string[] = [];

        const allQuestionIdFetched: string[] = [];

        questions.forEach(q => {
          allQuestionIdFetched.push(q?.latestCompletedVersion.id as string);
          if (
            q?.masterSubCategory?.id &&
            newSelectedCategoryIds.current.keys.includes(q.masterSubCategory.id)
          ) {
            newQuestionIds.push(q?.latestCompletedVersion.id as string);
          }
        });

        setQuestionListState(s => ({
          ...s,
          questions,
          selectedVersionIds:
            newSelectedCategoryIds.current.action === 'checked'
              ? [...s.selectedVersionIds, ...newQuestionIds]
              : [
                  ...new Set(
                    s.selectedVersionIds.reduce((res, key) => {
                      if (allQuestionIdFetched.includes(key)) {
                        res.push(key);
                      }
                      return res;
                    }, newQuestionIds),
                  ),
                ],
        }));
      },
      onError,
      enabled: selectedCategoryIds.length !== 0,
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
        );

        if (!question) return;

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
    onCloseModal();
  }, [
    onCloseModal,
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
      width={800}
      footer={
        <Button
          icon={<PlusOutLinedIcon />}
          className={'info-btn'}
          type={'primary'}
          disabled={!questionListState.selectedVersionIds.length}
          onClick={handleAddQuestions}
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
