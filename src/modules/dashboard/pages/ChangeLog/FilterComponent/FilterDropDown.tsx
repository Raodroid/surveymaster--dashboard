import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import * as Yup from 'yup';
import {
  GetListQuestionDto,
  IOptionItem,
  IQuestionCategory,
  QsParams,
  QuestionHistoryType,
  QuestionType,
  SurveyHistoryType,
} from 'type';
import { TFunction, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import moment, { Moment } from 'moment';
import qs from 'qs';
import { MOMENT_FORMAT, ROUTE_PATH } from 'enums';
import { Formik } from 'formik';
import { RollbackOutlined } from 'icons';
import { Button, Form } from 'antd';
import { INPUT_TYPES } from '@input/type';
import styled from 'styled-components/macro';
import templateVariable from 'app/template-variables.module.scss';
import { transformEnumToOption } from 'utils';
import { ControlledInput } from '@/modules/common';
import { useParseQueryString } from '@/hooks';
import { useGetAllCategories } from '@pages/QuestionBank/util';

const CHECKBOX_KEY = {
  filterByCategory: 'filterByCategory',
  filterBySubCategory: 'filterBySubCategory',
  filterByCreatedDate: 'filterByCreatedDate',
  filterByProject: 'filterByProject',
  filterByActionType: 'filterByActionType',
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
    checkKey: CHECKBOX_KEY.filterByActionType,
    key: 'types',
  },
  {
    checkKey: CHECKBOX_KEY.filterByProject,
    key: 'projectIds',
  },
];

// interface IFilerDropdown {
//   numOfFilter: number;
//   setNumOfFilter: Dispatch<SetStateAction<number>>;
//   type: 'Survey' | 'Question';
// }

type IFilerDropdown<P extends 'Survey' | 'Question'> = {
  numOfFilter: number;
  setNumOfFilter: Dispatch<SetStateAction<number>>;
  type: P;
};

const formSchema = Yup.object();

interface IFormValue {
  filterByCreatedDate: boolean;
  createdFrom: string | Moment;
  createdTo: string | Moment;
  filterByActionType: boolean;
}

interface ISurveyFilter extends IFormValue {
  filterByProject: boolean;
  projectIds: string[];
  types: SurveyHistoryType[];
}

interface IQuestionFilter extends IFormValue {
  filterByCategory: boolean;
  filterBySubCategory: boolean;
  types: QuestionHistoryType[];
}

type InitValue = {
  Survey: ISurveyFilter;
  Question: IQuestionFilter;
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
const genOptionsFromEnum = (
  type: 'Survey' | 'Question',
  t: TFunction<'translation', undefined>,
): IOptionItem[] => {
  const objectType =
    type === 'Survey' ? SurveyHistoryType : QuestionHistoryType;
  return Object.keys(objectType).map(key => ({
    value: objectType[key],
    label: t(`actionTypeShort.${objectType[key]}`),
  }));
};
export const FilerDropdown: FC<
  IFilerDropdown<'Survey' | 'Question'>
> = props => {
  const { numOfFilter, setNumOfFilter, type } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { categories, categoryOptions, isLoading } = useGetAllCategories();
  const [subCategoryOptions, setSubCategoryOptions] = useState<IOptionItem[]>(
    getChildCategoryOptions(categories),
  );

  const qsParams = useParseQueryString<{
    subCategoryIds?: string[];
    categoryIds?: string[];
    types?: InitValue[typeof type]['types'];
    projectIds?: string[];
    createdFrom?: string;
    createdTo?: string;
  }>();

  const initialFilterFormValues = useMemo<InitValue[typeof type]>(() => {
    const generalField: IFormValue = {
      filterByCreatedDate: !!(qsParams.createdFrom || qsParams.createdTo),
      createdFrom: qsParams.createdFrom ? moment(qsParams.createdFrom) : '',
      createdTo: qsParams.createdTo ? moment(qsParams.createdTo) : '',
      filterByActionType: !!(qsParams.types && qsParams?.types?.length !== 0),
    };

    if (type === 'Survey') {
      return {
        ...generalField,
        filterByProject: !!(
          qsParams.projectIds && qsParams?.projectIds?.length !== 0
        ),
        projectIds: qsParams.projectIds || [],
        types: qsParams.types || [],
      } as ISurveyFilter;
    }

    return {
      ...generalField,
      filterByCategory: !!(
        qsParams.categoryIds && qsParams?.categoryIds?.length !== 0
      ),
      categoryIds: qsParams?.categoryIds || [],
      subCategoryIds: qsParams?.subCategoryIds || [],
      filterBySubCategory: !!(
        qsParams?.subCategoryIds && qsParams?.subCategoryIds.length !== 0
      ),
      types: qsParams.types || [],
    } as IQuestionFilter;
  }, [
    qsParams?.categoryIds,
    qsParams.createdFrom,
    qsParams.createdTo,
    qsParams.projectIds,
    qsParams?.subCategoryIds,
    qsParams.types,
    type,
  ]);

  const onFinish = useCallback(
    (values: typeof initialFilterFormValues) => {
      const result = filterKeyPairArr.reduce((nextQueryObject: any, i) => {
        const { checkKey, key, formatMoment } = i;
        if (values[checkKey] && values[key]) {
          nextQueryObject[key] = formatMoment
            ? moment(values[key]).format()
            : values[key];
        }
        return nextQueryObject;
      }, {});

      const nextQueryString = qs.stringify(result);
      navigate(`${window.location.pathname}?type=${type}&${nextQueryString}`, {
        replace: true,
      });
    },
    [navigate, type],
  );

  const handleRollback = useCallback(() => {
    navigate(`${window.location.pathname}?type=${type}`, {
      replace: true,
    });
  }, [navigate, type]);

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onFinish}
      initialValues={initialFilterFormValues}
      validationSchema={formSchema}
    >
      {({ handleSubmit, setFieldValue }) => (
        <FilerDropdownWrapper>
          <div className={'FilerDropdown__header'}>
            <div className={'FilerDropdown__header__main'}>
              <span className={'form-title'}>{t('common.filter')}</span>
              <span className={'filter-tag'}>{numOfFilter}</span>
            </div>
            <div className={'FilerDropdown__header__left-side'}>
              <Button
                onClick={handleRollback}
                type={'text'}
                ghost
                style={{ width: 'fit-content' }}
                aria-label={'clear filter'}
              >
                <RollbackOutlined className={'rollback-icon'} />
              </Button>
            </div>
          </div>
          <div className={'FilerDropdown__body'}>
            <Form
              id={'filter-form'}
              layout={'vertical'}
              onFinish={handleSubmit}
              className={'sign-in-form'}
            >
              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX}
                    name="filterByCreatedDate"
                    aria-label={'filterByCreatedDate'}
                  >
                    {t('common.dataCreationDate')}
                  </ControlledInput>
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.DAY_PICKER}
                    name="createdFrom"
                    aria-label="createdFrom"
                    suffixIcon={false}
                  />
                  <ControlledInput
                    inputType={INPUT_TYPES.DAY_PICKER}
                    name="createdTo"
                    aria-label="createdTo"
                    suffixIcon={false}
                  />
                </div>
              </div>
              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX}
                    name="filterByActionType"
                    aria-label="filterByActionType"
                    className={'hide-helper-text'}
                  >
                    {t('common.actionType')}
                  </ControlledInput>
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    loading={isLoading}
                    inputType={INPUT_TYPES.SELECT}
                    name="types"
                    aria-label="types"
                    options={genOptionsFromEnum(type, t)}
                    mode={'multiple'}
                    maxTagCount="responsive"
                    className={'hide-helper-text'}
                  />
                </div>
              </div>
              {type === 'Survey' && (
                <>
                  <div className={'FilerDropdown__body__row'}>
                    <div className={'FilerDropdown__body__row__first'}>
                      <ControlledInput
                        inputType={INPUT_TYPES.CHECKBOX}
                        name="filterByProject"
                        aria-label="filterByProject"
                        className={'hide-helper-text'}
                      >
                        {t('common.project')}
                      </ControlledInput>
                    </div>
                    <div className={'FilerDropdown__body__row__second'}>
                      <ControlledInput
                        loading={isLoading}
                        inputType={INPUT_TYPES.SELECT}
                        name="categoryIds"
                        aria-label="categoryIds"
                        options={categoryOptions}
                        mode={'multiple'}
                        maxTagCount="responsive"
                        className={'hide-helper-text'}
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
                </>
              )}
              {type === 'Question' && (
                <>
                  <div className={'FilerDropdown__body__row'}>
                    <div className={'FilerDropdown__body__row__first'}>
                      <ControlledInput
                        inputType={INPUT_TYPES.CHECKBOX}
                        name="filterByCategory"
                        aria-label="filterByCategory"
                        className={'hide-helper-text'}
                      >
                        {t('common.category')}
                      </ControlledInput>
                    </div>
                    <div className={'FilerDropdown__body__row__second'}>
                      <ControlledInput
                        loading={isLoading}
                        inputType={INPUT_TYPES.SELECT}
                        name="categoryIds"
                        aria-label="categoryIds"
                        options={categoryOptions}
                        mode={'multiple'}
                        maxTagCount="responsive"
                        className={'hide-helper-text'}
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
                  <div className={'FilerDropdown__body__row'}>
                    <div className={'FilerDropdown__body__row__first'}>
                      <ControlledInput
                        inputType={INPUT_TYPES.CHECKBOX}
                        name="filterBySurvey"
                        aria-label="filterBySurvey"
                      >
                        {t('common.subCategory')}
                      </ControlledInput>
                    </div>
                    <div className={'FilerDropdown__body__row__second'}>
                      <ControlledInput
                        inputType={INPUT_TYPES.SELECT}
                        name="subCategoryIds"
                        aria-label="subCategoryIds"
                        mode={'multiple'}
                        maxTagCount="responsive"
                        options={subCategoryOptions}
                      />
                    </div>
                  </div>
                </>
              )}{' '}
            </Form>
          </div>
          <div className={'FilerDropdown__footer'}>
            <Button
              type={'primary'}
              className={'secondary-btn'}
              htmlType={'submit'}
              form={'filter-form'}
            >
              {t('common.apply')}
            </Button>
          </div>
        </FilerDropdownWrapper>
      )}
    </Formik>
  );
};

const FilerDropdownWrapper = styled.div`
  width: 316px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .FilerDropdown {
    &__header {
      border-bottom: 1px solid ${templateVariable.border_color};
      display: flex;
      align-items: center;
      padding-bottom: 1rem;

      .rollback-icon {
        color: ${templateVariable.primary_color};
        cursor: pointer;
      }

      &__main {
        flex: 1;
        color: ${templateVariable.text_primary_color};

        .filter-tag {
          background: ${templateVariable.border_color};
          border-radius: 4px;
          padding: 0.3rem 1rem;
          font-size: 12px;
          font-weight: 600;
          margin-left: ${templateVariable.element_spacing};
        }

        .form-title {
          font-size: 16px;
          font-weight: 600;
        }
      }

      &__side {
        width: 30px;
        margin-left: 1rem;
      }
    }

    &__body {
      &__row {
        margin-bottom: 1rem;

        &__first {
        }

        &__second {
          margin-left: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;

          .form-item-container {
            width: 100%;
          }
        }
      }
      .ant-form-item {
        margin-bottom: 0;
      }
    }
    &__footer {
      .ant-btn {
        width: 100%;
      }
    }
  }
`;
