import { Form } from 'antd';
import { Formik } from 'formik';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';
import Month from './Month';
import { CalendarScrollbarWrapper } from './styles';
import Thumbnail from './Thumbnail';

function CalendarScrollbar() {
  const handleSubmit = () => {};

  const initMonths = ['April', 'Jun', 'May'];

  return (
    <CalendarScrollbarWrapper>
      <Thumbnail />
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: handleFinish }) => (
          <Form
            layout="vertical"
            onFinish={handleFinish}
            className="height-100"
          >
            <ControlledInput name="today" inputType={INPUT_TYPES.INPUT} />
            {initMonths.map(month => (
              <Month month={month} key={month} />
            ))}
            <ControlledInput name="createdDay" inputType={INPUT_TYPES.INPUT} />
          </Form>
        )}
      </Formik>
    </CalendarScrollbarWrapper>
  );
}

export default CalendarScrollbar;
