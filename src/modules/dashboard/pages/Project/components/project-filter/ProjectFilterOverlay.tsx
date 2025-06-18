import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { matchPath } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';
import { useCallback, useMemo } from 'react';
import moment, { Moment } from 'moment';
import qs from 'qs';
import { Formik } from 'formik';
import { Button, Divider, Form, Tag } from 'antd';
import { ArrowDown, RollbackOutlined } from '@/icons';
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

export function ProjectFilterOverlay(props: IFilter) {
  const { counter } = props;
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

  const initialValues = useMemo<FilterParams>(() => {
    return {
      dateCreation: !!(qsParams.createdFrom || qsParams.createdTo),
      isDeleted: qsParams.isDeleted === 'true',
      createdFrom: qsParams.createdFrom && moment(qsParams.createdFrom),
      createdTo: qsParams.createdTo && moment(qsParams.createdTo),
    };
  }, [qsParams]);

  const handleRollback = useCallback(() => {
    navigate(ROUTE_PATH.DASHBOARD_PATHS.PROJECT.ROOT, { replace: true });
  }, [navigate]);

  const handleSubmit = (payload: FilterParams) => {
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

  const optionName: string = (() => {
    if (isShowSurveyTable) {
      return t('common.showDeletedSurveys');
    }
    if (isShowProjectTable) {
      return t('common.showDeletedProjects');
    }
    return '';
  })();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit: handleFinish, setFieldValue }) => (
        <div className={'w-[316px] p-1.5'}>
          <div className={'flex items-center'}>
            <div className={'flex-1'}>
              <span className={'text-[16px] font-semibold mr-3'}>
                {t('common.filter')}
              </span>
              <Tag className={'w-min inline py-1'}>{counter}</Tag>
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
          <Form onFinish={handleFinish} className="flex flex-col gap-3">
            <ControlledInput
              name="isDeleted"
              inputType={INPUT_TYPES.CHECKBOX}
              aria-label={'isDeleted'}
              className={'hide-helper-text'}
            >
              {optionName}
            </ControlledInput>
            <div>
              <ControlledInput
                name="dateCreation"
                inputType={INPUT_TYPES.CHECKBOX}
                onChange={e => setFieldValue('dateCreation', e)}
                aria-label={'dateCreation'}
                className={'hide-helper-text'}
              >
                {t('common.dataCreationRange')}
              </ControlledInput>
              <div className="flex items-center justify-center gap-3 dates ml-[1.5rem]">
                <ControlledInput
                  name="createdFrom"
                  inputType={INPUT_TYPES.DAY_PICKER}
                  suffixIcon={<ArrowDown />}
                  aria-label={'createdFrom'}
                  className={'hide-helper-text'}
                />

                <ControlledInput
                  name="createdTo"
                  inputType={INPUT_TYPES.DAY_PICKER}
                  suffixIcon={<ArrowDown />}
                  aria-label={'createdTo'}
                  className={'hide-helper-text'}
                />
              </div>
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
}
