import { FC, useCallback, useMemo, useState } from 'react';
import { IOptionItem, IQuestionCategory, QsParams, QuestionType } from 'type';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetAllCategories } from '../../../util';
import moment, { Moment } from 'moment';
import qs from 'qs';
import { MOMENT_FORMAT, ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { RollbackOutlined } from 'icons';
import { Button, Divider, Form, Tag } from 'antd';
import { INPUT_TYPES } from '@input/type';
import { transformEnumToOption } from 'utils';
import { ControlledInput } from '@/modules/common';
import { useParseQueryString } from '@/hooks';

const CHECKBOX_KEY = {
  filterByCategory: 'filterByCategory',
  filterBySubCategory: 'filterBySubCategory',
  filterByCreatedDate: 'filterByCreatedDate',
  filterByAnswerType: 'filterByAnswerType',
  isDeleted: 'isDeleted',
};

const filterKeyPairArr: {
  checkKey: string;
  key: string;
  formatMoment?: string;
}[] = [
  {
    checkKey: CHECKBOX_KEY.filterByCategory,
    key: 'categoryIds',
  },
  {
    checkKey: CHECKBOX_KEY.filterBySubCategory,
    key: 'subCategoryIds',
  },
  {
    checkKey: CHECKBOX_KEY.filterByCreatedDate,
    key: 'createdFrom',
    formatMoment: MOMENT_FORMAT.FULL_DATE_FORMAT,
  },
  {
    checkKey: CHECKBOX_KEY.filterByCreatedDate,
    key: 'createdTo',
    formatMoment: MOMENT_FORMAT.FULL_DATE_FORMAT,
  },
  {
    checkKey: CHECKBOX_KEY.filterByAnswerType,
    key: 'types',
  },
];

const initialFilterFormValues: IFormValue = {
  filterByAnswerType: false,
  filterByCreatedDate: false,
  filterByCategory: false,
  filterBySubCategory: false,
  createdFrom: '',
  createdTo: '',
  isDeleted: false,
  types: [],
  subCategoryIds: [],
  categoryIds: [],
};

interface IFilerDropdown {
  numOfFilter: number;
}

type IFormValue = {
  filterByAnswerType: boolean;
  filterByCreatedDate: boolean;
  filterByCategory: boolean;
  filterBySubCategory: boolean;
  createdFrom: string | Moment;
  createdTo: string | Moment;
  isDeleted: boolean;
  types: Array<QuestionType>;
  subCategoryIds: string[];
  categoryIds: string[];
};

const getChildCategoryOptions = (parentCategories: IQuestionCategory[]) =>
  parentCategories.reduce((preV: IOptionItem[], category) => {
    if (!category.children?.length) return preV;

    const subCategories = category?.children.map(c => ({
      label: `${c.name}`,
      value: `${c.id}`,
    }));
    return [...preV, ...subCategories];
  }, []);

export const FilerDropdown: FC<IFilerDropdown> = props => {
  const { numOfFilter } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qsParams = useParseQueryString<
    QsParams & {
      types: Array<QuestionType>;
      subCategoryIds: string[];
      categoryIds: string[];
    }
  >();
  const { categories, categoryOptions, isLoading } = useGetAllCategories();
  const [subCategoryOptions, setSubCategoryOptions] = useState<IOptionItem[]>(
    getChildCategoryOptions(categories),
  );

  const initialValues = useMemo<IFormValue>(() => {
    return {
      ...initialFilterFormValues,
      ...qsParams,
      filterByCreatedDate: !!(qsParams.createdFrom || qsParams.createdTo),
      filterByAnswerType: !!qsParams.types,
      filterBySubCategory: !!qsParams.subCategoryIds,
      filterByCategory: !!qsParams.categoryIds,
      isDeleted: qsParams.isDeleted === 'true',
      createdFrom: (qsParams.createdFrom && moment(qsParams.createdFrom)) || '',
      createdTo: (qsParams.createdTo && moment(qsParams.createdTo)) || '',
      types: qsParams.types,
      categoryIds: qsParams.categoryIds,
      subCategoryIds: qsParams.subCategoryIds,
    };
  }, [qsParams]);

  const onFinish = useCallback(
    (values: IFormValue) => {
      const result = filterKeyPairArr.reduce((nextQueryObject: any, i) => {
        const { checkKey, key, formatMoment } = i;
        if (values[checkKey] && values[key]) {
          nextQueryObject[key] = formatMoment
            ? moment(values[key]).format()
            : values[key];
        }
        return nextQueryObject;
      }, {});

      if (values.isDeleted) {
        result.isDeleted = true;
      }

      const nextQueryString = qs.stringify(result);

      navigate(
        `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT}?${nextQueryString}`,
        { replace: true },
      );
    },
    [navigate],
  );

  const handleRollback = useCallback(() => {
    navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT, { replace: true });
  }, [navigate]);

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onFinish}
      initialValues={initialValues}
    >
      {({ handleSubmit, setFieldValue }) => (
        <div className={'w-[316px] p-1.5'}>
          <div className={'flex items-center'}>
            <div className={'flex-1'}>
              <span className={'text-[16px] font-semibold mr-3'}>
                {t('common.filter')}
              </span>
              <Tag className={'w-min inline py-1'}>{numOfFilter}</Tag>
            </div>
            <Button
              onClick={() => {
                handleRollback();
              }}
              type={'text'}
              style={{ width: 'fit-content' }}
              aria-label={'clear filter'}
            >
              <RollbackOutlined />
            </Button>
          </div>
          <Divider className={'my-3'} />

          <Form onFinish={handleSubmit} className={'flex flex-col gap-3'}>
            <ControlledInput
              inputType={INPUT_TYPES.CHECKBOX}
              name="isDeleted"
              aria-label={'isDeleted'}
              className={'hide-helper-text'}
            >
              {t('common.showDeletedQuestion')}
            </ControlledInput>
            <div>
              <ControlledInput
                inputType={INPUT_TYPES.CHECKBOX}
                name="filterByCreatedDate"
                aria-label={'filterByCreatedDate'}
                className={'hide-helper-text'}
              >
                {t('common.dataCreationDate')}
              </ControlledInput>
              <div className={'flex items-center gap-3 ml-[1.5rem]'}>
                <ControlledInput
                  inputType={INPUT_TYPES.DAY_PICKER}
                  name="createdFrom"
                  aria-label="createdFrom"
                  suffixIcon={false}
                  className={'w-full hide-helper-text'}
                />
                <ControlledInput
                  inputType={INPUT_TYPES.DAY_PICKER}
                  name="createdTo"
                  aria-label="createdTo"
                  suffixIcon={false}
                  className={'w-full hide-helper-text'}
                />
              </div>
            </div>
            <div>
              <ControlledInput
                inputType={INPUT_TYPES.CHECKBOX}
                name="filterByCategory"
                aria-label="filterByCategory"
                className={'hide-helper-text'}
              >
                {t('common.category')}
              </ControlledInput>
              <div>
                <ControlledInput
                  loading={isLoading}
                  inputType={INPUT_TYPES.SELECT}
                  name="categoryIds"
                  aria-label="categoryIds"
                  options={categoryOptions}
                  mode={'multiple'}
                  maxTagCount="responsive"
                  className={'hide-helper-text ml-[1.5rem]'}
                  onChange={(selectedCategoryIds: any) => {
                    const subOptions = getChildCategoryOptions(
                      selectedCategoryIds.length
                        ? categories.filter(c =>
                            selectedCategoryIds.includes(c.id),
                          )
                        : categories,
                    );
                    setSubCategoryOptions(subOptions);
                    setFieldValue('subCategoryIds', []);
                  }}
                />
              </div>
            </div>
            <div>
              <ControlledInput
                inputType={INPUT_TYPES.CHECKBOX}
                name="filterBySubCategory"
                aria-label="filterBySubCategory"
                className={'hide-helper-text'}
              >
                {t('common.subCategory')}
              </ControlledInput>
              <div className={'FilerDropdown__body__row__second'}>
                <ControlledInput
                  loading={isLoading}
                  inputType={INPUT_TYPES.SELECT}
                  name="subCategoryIds"
                  aria-label="subCategoryIds"
                  mode={'multiple'}
                  className={'hide-helper-text ml-[1.5rem]'}
                  maxTagCount="responsive"
                  options={subCategoryOptions}
                />
              </div>
            </div>
            <div>
              <ControlledInput
                inputType={INPUT_TYPES.CHECKBOX}
                name="filterByAnswerType"
                aria-label="filterByAnswerType"
                className={'hide-helper-text'}
              >
                {t('common.answerType')}
              </ControlledInput>
              <ControlledInput
                inputType={INPUT_TYPES.SELECT}
                name="types"
                aria-label="types"
                mode={'multiple'}
                className={'hide-helper-text ml-[1.5rem]'}
                maxTagCount="responsive"
                options={transformEnumToOption(QuestionType, questionType =>
                  t(`questionType.${questionType}`),
                )}
              />
            </div>
            <div>
              <Button
                type={'primary'}
                className={'secondary-btn w-full mt-3'}
                htmlType={'submit'}
              >
                {t('common.apply')}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};
