import React, { Dispatch, FC, SetStateAction, useCallback } from 'react';
import * as Yup from 'yup';
import {
  GetListQuestionDto,
  IOptionItem,
  QuestionType,
} from '../../../../../../../type';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetAllCategories } from '../../../util';
import moment from 'moment';
import qs from 'qs';
import { MOMENT_FORMAT, ROUTE_PATH } from '../../../../../../../enums';
import { Formik } from 'formik';
import { RollbackOutlined } from '../../../../../../../icons';
import { Button, Form } from 'antd';
import { ControlledInput } from '../../../../../../common';
import { INPUT_TYPES } from '../../../../../../common/input/type';
import styled from 'styled-components';
import templateVariable from '../../../../../../../app/template-variables.module.scss';
import { transformEnumToOption } from '../../../../../../../utils';
import { values } from 'lodash';

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
};

interface IFilerDropdown {
  numOfFilter: number;
  setNumOfFilter: Dispatch<SetStateAction<number>>;
}
const formSchema = Yup.object();

interface IFormValue extends GetListQuestionDto {
  filterByAnswerType: boolean;
  filterByCreatedDate: boolean;
  filterByCategory: boolean;
  filterBySubCategory: boolean;
}

export const FilerDropdown: FC<IFilerDropdown> = props => {
  const { numOfFilter, setNumOfFilter } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categories, categoryOptions, isLoading } = useGetAllCategories();

  const onFinish = useCallback(
    (values: IFormValue) => {
      const filterCount = Object.keys(values).filter(key => {
        const val = values[key];
        return CHECKBOX_KEY[key] && val === true;
      });
      setNumOfFilter(filterCount.length);

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
    [navigate, setNumOfFilter],
  );

  const handleRollback = useCallback(
    callback => {
      callback();
      setNumOfFilter(0);
    },
    [setNumOfFilter],
  );

  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onFinish}
      initialValues={initialFilterFormValues}
      validationSchema={formSchema}
      render={({ handleSubmit, resetForm, values, setFieldValue }) => (
        <FilerDropdownWrapper>
          <div className={'FilerDropdown__header'}>
            <div className={'FilerDropdown__header__main'}>
              <span className={'form-title'}>{t('common.filter')}</span>
              <span className={'filter-tag'}>{numOfFilter}</span>
            </div>
            <div className={'FilerDropdown__header__left-side'}>
              <Button
                onClick={() => {
                  handleRollback(resetForm);
                }}
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
                    name="isDeleted"
                    children={'Show Deleted Question'}
                    aria-label={'isDeleted'}
                  />
                </div>
              </div>
              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX}
                    name="filterByCreatedDate"
                    aria-label={'filterByCreatedDate'}
                    children={'Data Creation Date'}
                  />
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
                    name="filterByCategory"
                    aria-label="filterByCategory"
                    children={t('common.category')}
                  />
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
                    onChange={() => {
                      setFieldValue('subCategoryIds', []);
                    }}
                  />
                </div>
              </div>
              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX}
                    name="filterBySubCategory"
                    aria-label="filterBySubCategory"
                    children={t('common.subCategory')}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    loading={isLoading}
                    inputType={INPUT_TYPES.SELECT}
                    name="subCategoryIds"
                    aria-label="subCategoryIds"
                    mode={'multiple'}
                    maxTagCount="responsive"
                    options={(values?.categoryIds || []).reduce(
                      (res: IOptionItem[], id) => {
                        const x = categories?.find(i => i.id === id);
                        if (!x) return res;
                        x.children?.forEach(child => {
                          res.push({
                            label: child.name as string,
                            value: child.id as string,
                          });
                        });
                        return res;
                      },
                      [],
                    )}
                  />
                </div>
              </div>
              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX}
                    name="filterByAnswerType"
                    aria-label="filterByAnswerType"
                    children={t('common.answerType')}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.SELECT}
                    name="types"
                    aria-label="types"
                    mode={'multiple'}
                    maxTagCount="responsive"
                    options={transformEnumToOption(QuestionType, questionType =>
                      t(`questionType.${questionType}`),
                    )}
                  />
                </div>
              </div>
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
    />
  );
};

const FilerDropdownWrapper = styled.div`
  width: 316px;
  border-radius: ${templateVariable.border_radius};
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  background: white;
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
