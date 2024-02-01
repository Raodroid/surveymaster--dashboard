import { useCallback, useMemo } from 'react';
import { EditQuestionWrapper } from './style';
import GeneralSectionHeader from '@components/GeneralSectionHeader/GeneralSectionHeader';
import { useTranslation } from 'react-i18next';
import { Button, Form, notification } from 'antd';
import QuestionCategoryForm from '../AddQuestion/QuestionCategoryForm';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import qs from 'qs';
import { useMutation, useQueryClient } from 'react-query';
import { QuestionBankService } from '@/services';
import { onError } from 'utils';
import {
  BaseQuestionVersionDto,
  IBaseQuestionOptionsVersionDto,
  IQuestionVersion,
  IQuestionVersionPostNewDto,
  IQuestionVersionPutUpdateDtoExtendId,
  QuestionType,
  QuestionVersionStatus,
} from 'type';
import { ROUTE_PATH } from 'enums';
import { generatePath, useParams } from 'react-router';
import { useGetQuestionByQuestionId } from '../util';
import DisplayAnswerList from '../AddQuestion/DisplayAnswerList';
import DisplayTitle from '../AddQuestion/DisplayTitle';
import { generateRandom } from 'modules/common/funcs';
import { transformQuestionData } from '../AddQuestion/util';
import AddQuestionDetailForm from '../AddQuestion/QuestionDetailForm';
import { ADD_QUESTION_FIELDS } from '@/modules/common/validate/validate';
import { useParseQueryString } from '@/hooks';
import isNumber from 'lodash/isNumber';

export type IEditQuestionFormValue = BaseQuestionVersionDto & {
  masterCategoryId: string;
  masterSubCategoryId: string;
  masterVariableName: string;
  options?: IBaseQuestionOptionsVersionDto[];
};

const RANDOME_ID_PREFIX = 'random';

type transformDataType =
  | IQuestionVersionPostNewDto
  | IQuestionVersionPutUpdateDtoExtendId;
function transformData(
  input: IEditQuestionFormValue,
  questionData?: IQuestionVersion,
): transformDataType | undefined {
  if (!questionData) return undefined;

  const {
    id,
    masterSubCategoryId,
    masterVariableName,
    masterCategoryId,
    ...rest
  } = input;
  if (!id) return undefined;

  const newValue = transformQuestionData(rest);

  if (questionData.status === QuestionVersionStatus.COMPLETED) {
    return {
      version: newValue,
      questionId: questionData.questionId,
    } as IQuestionVersionPostNewDto;
  }

  return {
    id: id as string,
    version: newValue,
  } as IQuestionVersionPutUpdateDtoExtendId;
}

const EditQuestion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryString = useParseQueryString<{ version?: string }>();
  const params = useParams<{ questionId?: string }>();
  const [questionData, isLoading] = useGetQuestionByQuestionId(
    params.questionId as string,
  );

  const currentVersionQuestionData: IQuestionVersion | undefined = (
    questionData?.versions || []
  )?.find(version => version.displayId === queryString.version);

  const initValue = useMemo<IEditQuestionFormValue>(() => {
    const {
      masterCategoryId = '',
      masterSubCategoryId = '',
      masterVariableName = '',
    } = questionData;

    const value: IEditQuestionFormValue = {
      id: currentVersionQuestionData?.id,
      type: currentVersionQuestionData?.type || QuestionType.TEXT_ENTRY,
      title: currentVersionQuestionData?.title || '',
      masterCategoryId,
      masterSubCategoryId,
      masterVariableName,
      options: currentVersionQuestionData?.options
        ?.sort((a, b) => a.sort - b.sort)
        .map(opt => ({
          id: opt.id,
          sort: opt.sort,
          text: opt.text,
          keyPath: opt?.keyPath || '',
          imageUrl: opt.imageUrl,
        })) || [
        {
          id: `${RANDOME_ID_PREFIX}_${generateRandom()}`,
          text: '',
          sort: 1,
        },
      ],
      numberStep: currentVersionQuestionData?.numberStep || 1,
      numberMax: currentVersionQuestionData?.numberMax || 10,
      numberMin: currentVersionQuestionData?.numberMin || 1,
      maxDecimal: isNumber(currentVersionQuestionData?.maxDecimal)
        ? currentVersionQuestionData?.maxDecimal
        : undefined,
      dataMatrix: currentVersionQuestionData?.dataMatrix || {
        rows: [{ name: '', keyPath: '' }],
        columns: [{ name: '' }],
      },
      matrixType: currentVersionQuestionData?.matrixType,
      timeFormat: currentVersionQuestionData?.timeFormat,
      dateFormat: currentVersionQuestionData?.dateFormat,
      image: currentVersionQuestionData?.image || '',
    };
    if (
      currentVersionQuestionData?.status === QuestionVersionStatus.COMPLETED
    ) {
      value.status = QuestionVersionStatus.DRAFT;
    }

    return value;
  }, [currentVersionQuestionData, questionData]);

  const updateQuestionMutation = useMutation(
    (data: transformDataType) => {
      if (
        currentVersionQuestionData?.status === QuestionVersionStatus.COMPLETED
      ) {
        return QuestionBankService.createQuestionVersion(
          data as IQuestionVersionPostNewDto,
        );
      }
      return QuestionBankService.updateDraftQuestion(
        data as IQuestionVersionPutUpdateDtoExtendId,
      );
    },
    {
      onSuccess: async response => {
        const data: IQuestionVersion = response.data;
        await queryClient.invalidateQueries('getQuestionList');
        await queryClient.invalidateQueries('getQuestionQuery');
        notification.success({ message: t('common.updateSuccess') });
        navigate(
          `${generatePath(
            ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION,
            {
              questionId: params.questionId,
            },
          )}?${qs.stringify({
            version: data.displayId,
          })}`,
        );
      },
      onError,
    },
  );
  const onFinish = useCallback(
    async (values: IEditQuestionFormValue) => {
      const newValues: IEditQuestionFormValue = values;

      if (
        currentVersionQuestionData?.status === QuestionVersionStatus.COMPLETED
      ) {
        newValues.status = QuestionVersionStatus.DRAFT;

        if (values.options?.length !== 0)
          //remove id when create new question
          newValues.options = values.options?.map(
            ({ id, ...restOption }) => restOption,
          );
      }
      const newVal = transformData(newValues, currentVersionQuestionData);
      if (!newVal) return;

      await updateQuestionMutation.mutateAsync(
        newVal as IQuestionVersionPutUpdateDtoExtendId,
      );
    },
    [currentVersionQuestionData, updateQuestionMutation],
  );

  return (
    <EditQuestionWrapper>
      <GeneralSectionHeader title={t('common.editQuestion')} />
      <Formik
        enableReinitialize={true}
        onSubmit={onFinish}
        initialValues={initValue}
        validationSchema={ADD_QUESTION_FIELDS}
      >
        {({ handleSubmit, isValid, dirty }) => (
          <>
            <Form
              id={'edit-question-form'}
              layout={'vertical'}
              onFinish={handleSubmit}
              className={'QuestionContent__body'}
            >
              <div className={'QuestionContent__body__content-wrapper'}>
                <div
                  className={'QuestionContent__body__section question-section'}
                >
                  <div className={'question-section__row'}>
                    <div className={'question-detail-wrapper'}>
                      <div className={'question-section__row__title'}>
                        {t('common.questionDetails')}
                      </div>
                      <div className={'question-section__row__content'}>
                        <AddQuestionDetailForm />
                      </div>
                    </div>
                  </div>
                  <div className={'question-section__row'}>
                    <div className={'answer-list-wrapper'}>
                      <div className={'question-section__row__title'}>
                        <DisplayTitle />
                      </div>
                      <div className={'question-section__row__content'}>
                        <DisplayAnswerList />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={'divider'} />
                <div
                  className={'QuestionContent__body__section category-section'}
                >
                  <div className={'category-section__row__title'}>
                    {t('common.questionParameters')}
                  </div>
                  <QuestionCategoryForm disabled />
                </div>
              </div>
            </Form>
            <div className={'QuestionContent__footer'}>
              <div className={'QuestionContent__footer__submit-btn-wrapper'}>
                <Button
                  form={'edit-question-form'}
                  htmlType={'submit'}
                  className={'info-btn'}
                  type={'primary'}
                  disabled={!dirty || !isValid}
                  loading={isLoading}
                >
                  {t('common.saveNewQuestionVersion')}
                </Button>
              </div>
            </div>
          </>
        )}
      </Formik>
    </EditQuestionWrapper>
  );
};

export default EditQuestion;
