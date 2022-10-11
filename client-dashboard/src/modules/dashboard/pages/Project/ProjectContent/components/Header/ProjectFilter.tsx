import { Button, Divider, Dropdown, Form } from 'antd';
import { Formik } from 'formik';
import { ArrowDown, FilterOutlined } from 'icons';
import { Refresh } from 'icons/Refresh';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useState } from 'react';
import {
  ProjectFilterBtn,
  ProjectFilterOverlayWrapper,
  ProjectFilterWrapper,
} from './styles';

export interface IFilter {
  setParams?: (payload: any) => void;
  counter?: number;
  setCounter?: (payload: number) => void;
}

function ProjectFilter(props: IFilter) {
  const { setParams } = props;

  const [counter, setCounter] = useState(0);

  return (
    <ProjectFilterWrapper>
      <Dropdown
        overlay={
          <FilterOverlay
            setParams={setParams}
            counter={counter}
            setCounter={setCounter}
          />
        }
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

const initialValues = {
  dateCreation: false,
  isDeleted: false,
  createdFrom: null,
  createdTo: null,
};

function FilterOverlay(props: IFilter) {
  const { setParams, counter, setCounter } = props;

  const handleReset = (
    values,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined,
    ) => void,
  ) => {
    const valuesList = Object.keys(values);
    valuesList.forEach(elm => setFieldValue(elm, initialValues[elm]));
  };

  const handleSubmit = (payload: any) => {
    const list = Object.values(payload).filter(elm => elm === true);
    if (setCounter) setCounter(list.length);
    if (setParams)
      setParams({
        isDeleted: payload.isDeleted,
        createdFrom: payload.dateCreation
          ? payload?.createdFrom?.startOf('day')?._d
          : null,
        createdTo: payload.dateCreation
          ? payload?.createdTo?.endOf('day')?._d
          : null,
      });
  };

  return (
    <ProjectFilterOverlayWrapper>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit: handleFinish,
          isSubmitting,
          setFieldValue,
        }) => {
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
                      // disabled={!values.dateCreation}
                    />
                    -
                    <ControlledInput
                      name="createdTo"
                      inputType={INPUT_TYPES.DAY_PICKER}
                      suffixIcon={<ArrowDown />}
                      // disabled={!values.dateCreation}
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
