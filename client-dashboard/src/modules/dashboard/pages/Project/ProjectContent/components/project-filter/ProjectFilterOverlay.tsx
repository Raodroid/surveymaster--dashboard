import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { matchPath } from 'react-router-dom';
import { ROUTE_PATH } from 'enums';
import { useMemo } from 'react';
import moment, { Moment } from 'moment';
import qs from 'qs';
import { Formik } from 'formik';
import { Button, Divider, Form, Space } from 'antd';
import { ArrowDown, Refresh } from 'icons';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { IFilter } from './ProjectFilter';
import { useParseQueryString } from '@/hooks';
import { QsParams } from '@/type';

interface FilterParams {
  isDeleted?: boolean;
  dateCreation?: boolean;
  createdFrom?: Moment | string;
  createdTo?: Moment | string;
}

const defaultInit = {
  dateCreation: false,
  isDeleted: false,
  createdFrom: '',
  createdTo: '',
};

export function ProjectFilterOverlay(props: IFilter) {
  const { counter, setCounter } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const qsParams = useParseQueryString<QsParams>();
  const location = useLocation();

  const isShowProjectTable = matchPath(
    {
      path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT,
      caseSensitive: true,
      end: true,
    },
    location.pathname,
  );

  const isShowSurveyTable = matchPath(
    {
      path: ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY,
      caseSensitive: true,
      end: true,
    },
    location.pathname,
  );

  const initialValues: FilterParams = useMemo(() => {
    return {
      dateCreation: !!(qsParams.createdFrom || qsParams.createdTo),
      isDeleted: qsParams.isDeleted === 'true',
      createdFrom: qsParams.createdFrom && moment(qsParams.createdFrom),
      createdTo: qsParams.createdTo && moment(qsParams.createdTo),
    };
  }, [qsParams]);

  const handleReset = (
    values,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined,
    ) => void,
  ) => {
    const valuesList = Object.keys(values);
    valuesList.forEach(elm => setFieldValue(elm, defaultInit[elm]));
  };

  const handleSubmit = (payload: FilterParams) => {
    const list = Object.values(payload).filter(elm => elm === true);
    if (setCounter) setCounter(list.length);

    const payloadParams = {
      ...qsParams,
      q: qsParams.q || '',
      isDeleted: payload.isDeleted,
      createdFrom:
        payload.dateCreation && payload.createdFrom
          ? moment(payload.createdFrom).format()
          : '',
      createdTo:
        payload.dateCreation && payload.createdTo
          ? moment(payload.createdTo).format()
          : '',
    };

    navigate(pathname + '?' + qs.stringify(payloadParams));
  };

  const optionName = useMemo<string>(() => {
    if (isShowSurveyTable) {
      return 'Show Deleted Surveys';
    }
    if (isShowProjectTable) {
      return 'Show Deleted Projects';
    }
    return '';
  }, [isShowProjectTable, isShowSurveyTable]);

  return (
    <div className={'bg-white p-3 shadow-md'}>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit: handleFinish, setFieldValue }) => {
          return (
            <Form layout="vertical" onFinish={handleFinish}>
              <div className="header flex-j-between">
                <div className="left flex-center">
                  {t('common.filters')}
                  <div className="counter flex-center">{counter}</div>
                </div>
                <div className="right">
                  <Button
                    onClick={() => handleReset(values, setFieldValue)}
                    aria-label={'clear filter'}
                  >
                    <Refresh />
                  </Button>
                </div>
              </div>
              <Divider />
              <div className="flex flex-col filters">
                <ControlledInput
                  name="isDeleted"
                  inputType={INPUT_TYPES.CHECKBOX}
                  children={optionName}
                  aria-label={'isDeleted'}
                />
                <div className="dates-filter">
                  <ControlledInput
                    name="dateCreation"
                    inputType={INPUT_TYPES.CHECKBOX}
                    children={'Data Creation Range'}
                    onChange={e => setFieldValue('dateCreation', e)}
                    aria-label={'dateCreation'}
                  />
                  <div className="flex-center dates">
                    <ControlledInput
                      name="createdFrom"
                      inputType={INPUT_TYPES.DAY_PICKER}
                      suffixIcon={<ArrowDown />}
                      aria-label={'createdFrom'}
                    />
                    -
                    <ControlledInput
                      name="createdTo"
                      inputType={INPUT_TYPES.DAY_PICKER}
                      suffixIcon={<ArrowDown />}
                      aria-label={'createdTo'}
                    />
                  </div>
                </div>

                <Button
                  className="secondary-btn"
                  type="primary"
                  htmlType="submit"
                >
                  {t('common.apply')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>{' '}
    </div>
  );
}
