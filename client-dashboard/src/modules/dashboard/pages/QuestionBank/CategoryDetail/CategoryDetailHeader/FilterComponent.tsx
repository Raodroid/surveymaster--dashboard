import styled from 'styled-components';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Form } from 'antd';
import templateVariable from 'app/template-variables.module.scss';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  GetListQuestionDto,
  IQuestionCategory,
  QuestionType,
} from '../../../../../../type';
import { ArrowDown, FilterOutlined, RollbackOutlined } from 'icons';
import { CategoryDetailContext } from '../index';
import { onError, transformEnumToOption } from '../../../../../../utils';
import { useQuery } from 'react-query';
import { QuestionBankService } from '../../../../../../services';
import _get from 'lodash/get';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';
import { ROUTE_PATH } from '../../../../../../enums';

const filterKeyPairArr: { checkKey: string; key: string }[] = [
  {
    checkKey: 'filterByCategory',
    key: 'categoryIds',
  },
  {
    checkKey: 'filterBySubCategory',
    key: 'subCategoryIds',
  },
  {
    checkKey: 'filterByCreatedDate',
    key: 'createdFrom',
  },
  {
    checkKey: 'filterByCreatedDate',
    key: 'createdTo',
  },
  {
    checkKey: 'filterByAnswerType',
    key: 'type',
  },
];

interface IOptionItem {
  label: string;
  value: string;
}

export const FilterComponent = () => {
  const [numOfFilter, setNumOfFilter] = useState(0);
  const { t } = useTranslation();
  return (
    <FilterComponentWrapper>
      <FilterOutlined className={'filter-icon'} />
      <span>{t('common.filter')}</span>
      <Dropdown
        trigger={['click']}
        placement="bottomRight"
        overlay={
          <FilerDropdown
            numOfFilter={numOfFilter}
            setNumOfFilter={setNumOfFilter}
          />
        }
      >
        <div className={'filter-main'}>
          <span onClick={e => e.preventDefault()}>
            {numOfFilter}
            <ArrowDown
              style={{ color: templateVariable.primary_color, height: 5 }}
            />
          </span>
        </div>
      </Dropdown>
    </FilterComponentWrapper>
  );
};

const initialFilterFormValues: IFormValue = {
  filterByAnswerType: false,
  filterByCreatedDate: false,
  filterByCategory: false,
  filterBySubCategory: false,
  createdFrom: '',
  createdTo: '',
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

const FilerDropdown: FC<IFilerDropdown> = props => {
  const { numOfFilter, setNumOfFilter } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getCategoryQuery = useQuery(
    ['getCategoriesFilter'],
    () => QuestionBankService.getCategories({ selectAll: true }),
    {
      onError,
    },
  );

  const categories = useMemo<IQuestionCategory[]>(
    () => _get(getCategoryQuery.data, 'data.data', []),
    [getCategoryQuery.data],
  );

  const categoryOptions = useMemo<IOptionItem[]>(
    () =>
      (categories || []).map(category => ({
        label: category.name as string,
        value: category.id as string,
      })),
    [categories],
  );

  const onFinish = useCallback(
    (values: IFormValue) => {
      const filterCount = Object.values(values).filter(val => val?.[0] === 1);
      setNumOfFilter(filterCount.length);

      const result = filterKeyPairArr.reduce((nextQueryObject: any, i) => {
        const { checkKey, key } = i;
        if (values[checkKey]) {
          nextQueryObject[key] = values[key];
        }
        return nextQueryObject;
      }, {});

      const nextQueryString = qs.stringify(result);
      navigate(
        `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT}?${nextQueryString}`,
        // { replace: true },
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
      render={({ handleSubmit, resetForm, values }) => (
        <FilerDropdownWrapper>
          <div className={'FilerDropdown__header'}>
            <div className={'FilerDropdown__header__main'}>
              <span className={'form-title'}>{t('common.filter')}</span>
              <span className={'filter-tag'}>{numOfFilter}</span>
            </div>
            <div className={'FilerDropdown__header__left-side'}>
              <RollbackOutlined
                className={'rollback-icon'}
                onClick={() => {
                  handleRollback(resetForm);
                }}
              />
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
                    children={'Data Creation Date'}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.DAY_PICKER}
                    name="createdFrom"
                    suffixIcon={false}
                  />
                  <ControlledInput
                    inputType={INPUT_TYPES.DAY_PICKER}
                    name="createdTo"
                    suffixIcon={false}
                  />
                </div>
              </div>
              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX}
                    name="filterByCategory"
                    children={t('common.category')}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.SELECT}
                    name="categoryIds"
                    options={categoryOptions}
                    mode={'multiple'}
                    maxTagCount="responsive"
                  />
                </div>
              </div>
              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX}
                    name="filterBySubCategory"
                    children={t('common.subCategory')}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.SELECT}
                    name="subCategoryIds"
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
                    children={t('common.answerType')}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.SELECT}
                    name="type"
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

const FilterComponentWrapper = styled.div`
  display: flex;
  padding: 0 10px;
  align-items: center;
  border-radius: 4px;
  background: ${templateVariable.primary_color};
  color: white;
  .filter-icon {
    margin: 0 6px;
  }
  .filter-main {
    border-radius: 2px;
    background: white;
    color: ${templateVariable.text_primary_color};
    padding: 3px 10px;
    margin: 2px;
    transform: translateX(10px);
    span {
      font-size: 12px;
      font-weight: 600;
    }
  }
`;

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
