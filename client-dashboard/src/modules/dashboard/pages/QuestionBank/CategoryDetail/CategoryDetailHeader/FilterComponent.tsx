import styled from 'styled-components';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Form } from 'antd';
import templateVariable from 'app/template-variables.module.scss';
import { ControlledInput } from '../../../../../common';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { transformEnumToOption } from 'utils';
import { QuestionType } from '../../../../../../type';
import { ArrowDown, FilterOutlined, RollbackOutlined } from 'icons';

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
            {numOfFilter}{' '}
            <ArrowDown
              style={{ color: templateVariable.primary_color, height: 5 }}
            />
          </span>
        </div>
      </Dropdown>
    </FilterComponentWrapper>
  );
};

const initialFilterFormValues = {
  filterByAnswerType: '',
  filterByCreatedDate: '',
  filterByCategory: '',
  filterBySubCategory: '',
  startDate: '',
  endDate: '',
  category: '',
  subCategory: '',
  answerType: '',
};

interface IFilerDropdown {
  numOfFilter: number;
  setNumOfFilter: Dispatch<SetStateAction<number>>;
}
const formSchema = Yup.object();

const FilerDropdown: FC<IFilerDropdown> = props => {
  const { numOfFilter, setNumOfFilter } = props;
  const { t } = useTranslation();

  const onFinish = useCallback(
    values => {
      const filterCount = Object.values(values).filter(val => val?.[0] === 1);
      setNumOfFilter(filterCount.length);
    },
    [setNumOfFilter],
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
      onSubmit={onFinish}
      initialValues={initialFilterFormValues}
      validationSchema={formSchema}
      render={({ handleSubmit, resetForm }) => (
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
                    inputType={INPUT_TYPES.CHECKBOX_GROUP}
                    name="filterByCreatedDate"
                    options={[
                      {
                        label: 'Data Creation Date',
                        value: 1,
                      },
                    ]}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.DAY_PICKER}
                    name="startDate"
                    suffixIcon={false}
                  />
                  <ControlledInput
                    inputType={INPUT_TYPES.DAY_PICKER}
                    name="endDate"
                    suffixIcon={false}
                  />
                </div>
              </div>
              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX_GROUP}
                    name="filterByCategory"
                    options={[
                      {
                        label: t('common.category'),
                        value: 1,
                      },
                    ]}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.SELECT}
                    name="category"
                  />
                </div>
              </div>
              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX_GROUP}
                    name="filterBySubCategory"
                    options={[
                      {
                        label: t('common.subCategory'),
                        value: 1,
                      },
                    ]}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.SELECT}
                    name="subCategory"
                  />
                </div>
              </div>

              <div className={'FilerDropdown__body__row'}>
                <div className={'FilerDropdown__body__row__first'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.CHECKBOX_GROUP}
                    name="filterByAnswerType"
                    options={[
                      {
                        label: t('common.answerType'),
                        value: 1,
                      },
                    ]}
                  />
                </div>
                <div className={'FilerDropdown__body__row__second'}>
                  <ControlledInput
                    inputType={INPUT_TYPES.SELECT}
                    name="answerType"
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
