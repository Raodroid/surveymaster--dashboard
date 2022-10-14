import { Button, Divider, Dropdown, Form } from 'antd';
import { Formik } from 'formik';
import useParseQueryString from 'hooks/useParseQueryString';
import { ArrowDown, FilterOutlined } from 'icons';
import { Refresh } from 'icons/Refresh';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { IGetParams } from 'type';
import {
  ProjectFilterBtn,
  ProjectFilterOverlayWrapper,
  ProjectFilterWrapper,
} from './styles';
import { useEffect } from 'react';

export interface IFilter {
  counter?: number;
  setCounter?: (payload: number) => void;
}

function ProjectFilter() {
  const [counter, setCounter] = useState(0);
  const qsParams = useParseQueryString<{
    isDeleted?: string;
    createdFrom?: string;
    createdTo?: string;
  }>();

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
      >
        <ProjectFilterBtn type="primary" className="flex-j-end">
          <FilterOutlined />
          Filter
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
  const qsParams = useParseQueryString<{
    q?: string;
    isDeleted?: string;
    createdFrom?: string;
    createdTo?: string;
  }>();

  const initialValues = useMemo(() => {
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

  const handleSubmit = (payload: any) => {
    const list = Object.values(payload).filter(elm => elm === true);
    if (setCounter) setCounter(list.length);

    const payloadParams: IGetParams = {
      q: qsParams.q || '',
      isDeleted: payload.isDeleted,
      createdFrom:
        payload.dateCreation && payload.createdFrom ? payload.createdFrom : '',
      createdTo:
        payload.dateCreation && payload.createdTo ? payload.createdTo : '',
    };

    console.log(payloadParams);

    const keys = Object.keys(payloadParams);
    let result = '';
    keys.map(
      (key: string, index: number) =>
        (result =
          result +
          `${key}=${payloadParams[key]}${
            index !== keys.length - 1 ? '&' : ''
          }`),
    );
    navigate(pathname + '?' + result);
  };

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
                  Filters
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
                  children={'Show Deleted Projects'}
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
                  Apply
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </ProjectFilterOverlayWrapper>
  );
}
