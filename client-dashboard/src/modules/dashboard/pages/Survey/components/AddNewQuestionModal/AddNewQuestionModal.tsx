import React, {
  FC,
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IModal, IOptionItem, QuestionType } from '@/type';
import { Input, List, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { questionValueType, useSurveyFormContext } from '@pages/Survey';
import { useField } from 'formik';
import { useDebounce } from '@/utils';
import { SimpleBarCustom } from '@/customize-components';
import { AddNewQuestionModalWrapper } from '@pages/Survey/components/AddNewQuestionModal/style';

const initNewRowValue: questionValueType = {
  remark: '',
  parameter: '',
  sort: Math.random(),
  questionVersionId: '',
  id: '',
  questionTitle: '',
  type: QuestionType.TEXT_ENTRY,
  createdAt: '',
  category: '',
};

interface IAddNewQuestionModal extends IModal {
  fieldName: string;
}

const AddNewQuestionModal: FC<IAddNewQuestionModal> = props => {
  const { open, toggleOpen, fieldName } = props;

  const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);

  const { t } = useTranslation();
  const [searchTxt, setSearchTxt] = useState<string>('');

  const { question } = useSurveyFormContext();
  const {
    newQuestions,
    questionIdMap,
    setSearchParams,
    hasNextQuestionPage,
    fetchNextQuestionPage,
    isFetchingQuestion,
  } = question;

  const debounceSearchText = useDebounce(searchTxt);

  const availableQuestionOptions = useMemo<
    Array<IOptionItem & { categoryName: string }>
  >(
    () =>
      (newQuestions || []).reduce(
        (res: Array<IOptionItem & { categoryName: string }>, item) => {
          if (value?.some(i => i.questionVersionId === item?.id)) return res;
          return [
            ...res,
            {
              label: item.title,
              value: item.id as string,
              categoryName: item?.masterCategory?.name || '',
            },
          ];
        },
        [],
      ),
    [newQuestions, value],
  );

  const handleOnClose = useCallback(() => {
    setSearchParams({ q: '' });
    setSearchTxt('');
    toggleOpen();
  }, [setSearchParams, toggleOpen]);

  const handleSelectQuestion = useCallback(
    questionId => {
      const chooseQuestion = questionIdMap[questionId];

      if (chooseQuestion) {
        const newQuestion: questionValueType = {
          ...initNewRowValue,
          // remark: chooseQuestion?.remark,
          category:
            chooseQuestion?.masterCategory?.name ||
            (chooseQuestion.question?.masterCategory?.name as string),
          type: chooseQuestion?.type as string,
          questionTitle: chooseQuestion?.title as string,
          id: chooseQuestion?.questionId,
          questionVersionId: chooseQuestion?.id as string,
          versions: chooseQuestion?.question?.versions,
          createdAt: chooseQuestion.createdAt,
          sort: (value.at(-1)?.sort || 0) + 1,
        };
        setValue([...value, newQuestion]);

        setSearchTxt('');
      }
      toggleOpen();
    },
    [questionIdMap, toggleOpen, value, setValue],
  );

  useEffect(() => {
    setSearchParams({ q: debounceSearchText });
  }, [debounceSearchText, setSearchParams]);

  const refLoading = useRef<Element>();

  const observer = useMemo(
    () =>
      new IntersectionObserver(() => {
        if (hasNextQuestionPage) {
          console.log('called');
          fetchNextQuestionPage();
        }
      }),
    [fetchNextQuestionPage, hasNextQuestionPage],
  );

  useEffect(() => {
    return () => {
      if (refLoading.current) observer.unobserve(refLoading.current);
    };
  }, [observer]);

  return (
    <AddNewQuestionModalWrapper
      open={open}
      onCancel={handleOnClose}
      width={650}
      footer={false}
      centered
      title={t('common.addQuestion')}
    >
      <Input
        className={'search-input mb-3'}
        allowClear
        placeholder={`${t('common.searchQuestion')}...`}
        value={searchTxt}
        onChange={e => {
          setSearchTxt(e.target.value);
        }}
      />
      <Spin spinning={isFetchingQuestion}>
        <SimpleBarCustom>
          <List
            itemLayout="horizontal"
            dataSource={availableQuestionOptions}
            renderItem={item => (
              <List.Item
                onClick={() => handleSelectQuestion(item.value)}
                className={
                  'cursor-pointer hover:[#8c8c8c29] block text-textColor px-2'
                }
              >
                <div className={'font-semibold mb-2'}>{item.label}</div>
                <div className={'text-[12px]'}>{item.categoryName}</div>
              </List.Item>
            )}
          />
          <div
            className={`mb-5 ${hasNextQuestionPage ? 'visible' : 'hidden'}`}
            ref={newRef => {
              if (newRef) {
                refLoading.current = newRef;
                observer.observe(newRef);
              }
            }}
          >
            Loading...
          </div>
        </SimpleBarCustom>
      </Spin>
    </AddNewQuestionModalWrapper>
  );
};

export default AddNewQuestionModal;
