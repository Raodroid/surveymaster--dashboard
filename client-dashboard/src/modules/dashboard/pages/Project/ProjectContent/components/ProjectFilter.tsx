import { Button, Divider, Dropdown, Form } from 'antd';
import { Formik } from 'formik';
import useParseQueryString from 'hooks/useParseQueryString';
import { ArrowDown, FilterOutlined } from 'icons';
import { Refresh } from 'icons/Refresh';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import moment, { Moment } from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import {
  ProjectFilterBtn,
  ProjectFilterOverlayWrapper,
  ProjectFilterWrapper,
} from './Header/styles';
import qs from 'qs';
import { matchPath } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../enums';

export interface IFilter {
  counter?: number;
  setCounter?: (payload: number) => void;
}

interface FilterParams {
  isDeleted?: boolean;
  dateCreation?: boolean;
  createdFrom?: Moment | string;
  createdTo?: Moment | string;
}

export interface QsParams {
  q?: string;
  page?: number;
  take?: number;
  isDeleted?: string;
  createdFrom?: string;
  createdTo?: string;
}

function ProjectFilter() {
  const [counter, setCounter] = useState(0);
  const { t } = useTranslation();
  const qsParams = useParseQueryString<QsParams>();

  useEffect(() => {
    const list = Object.values({
      ...qsParams,
      dateCreation:
        qsParams.createdFrom || qsParams.createdTo ? 'true' : 'false',
    }).filter(elm => elm === 'true');

    if (setCounter) setCounter(list.length);
  }, [qsParams]);

  return (
    <ProjectFilterWrapper>
      <Dropdown
        overlay={<FilterOverlay counter={counter} setCounter={setCounter} />}
        trigger={['click']}
        placement="bottomRight"
      >
        <ProjectFilterBtn type="primary" className="flex-j-end">
          <FilterOutlined />
          {t('common.filters')}
          <div className="counter flex-center">
            {counter}
            <ArrowDown />
          </div>
        </ProjectFilterBtn>
      </Dropdown>
    </ProjectFilterWrapper>
  );
}

export default ProjectFilter;

const defaultInit = {
  dateCreation: false,
  isDeleted: false,
  createdFrom: '',
  createdTo: '',
};
function FilterOverlay(props: IFilter) {
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
      dateCreation: qsParams.createdFrom || qsParams.createdTo ? true : false,
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
    <ProjectFilterOverlayWrapper>
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
                  <Button onClick={() => handleReset(values, setFieldValue)}>
                    <Refresh />
                  </Button>
                </div>
              </div>
              <Divider />
              <div className="flex-column filters">
                <ControlledInput
                  name="isDeleted"
                  inputType={INPUT_TYPES.CHECKBOX}
                  children={optionName}
                />
                <div className="dates-filter">
                  <ControlledInput
                    name="dateCreation"
                    inputType={INPUT_TYPES.CHECKBOX}
                    children={'Data Creation Range'}
                    onChange={e => setFieldValue('dateCreation', e)}
                  />
                  <div className="flex-center dates">
                    <ControlledInput
                      name="createdFrom"
                      inputType={INPUT_TYPES.DAY_PICKER}
                      suffixIcon={<ArrowDown />}
                    />
                    -
                    <ControlledInput
                      name="createdTo"
                      inputType={INPUT_TYPES.DAY_PICKER}
                      suffixIcon={<ArrowDown />}
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
      </Formik>
    </ProjectFilterOverlayWrapper>
  );
}
