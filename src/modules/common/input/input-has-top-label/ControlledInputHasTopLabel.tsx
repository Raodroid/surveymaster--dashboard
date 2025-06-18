import { Col, Form, Row } from 'antd';
import { FastField, Field, useField } from 'formik';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ControlledInputProps, INPUT_TYPES } from '../type';
import UncontrollInput from '../uncontrolled-input/UncontrollInput';

const ControlledInputHasTopLabel = (props: ControlledInputProps) => {
  const {
    isFastField, //This has to be false if Question is a condition question
    name,
    customFormProps,
    inputType,
    label,
    isOptionValue,
    errorMessage,
    onChange,
    className = '',
    ...rest
  } = props;
  const [t] = useTranslation();
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;
  const { touched, error } = meta;
  const inputRef = useRef<any>();

  useEffect(() => {
    const handleClick = () =>
      setValue(inputType === INPUT_TYPES.SELECT ? [] : '');
    const elm = inputRef.current.querySelector(
      'div.form-item-container .anticon-close-circle',
    );
    elm?.addEventListener('click', handleClick);

    return () => {
      elm?.removeEventListener('click', handleClick);
    };
  });

  const replaceOnChange = useCallback(
    (
      value: string | number,
      option: { value: string | number; label: string },
    ) => {
      if (!isOptionValue) {
        setValue(value);

        onChange && onChange(value);
      } else setValue(option);
    },
    [isOptionValue, onChange, setValue],
  );

  const onBlur = useCallback(
    e => {
      if (rest.onBlur) {
        rest.onBlur(e);
      }
      field.onBlur(e);
    },
    [field, rest],
  );

  const validateStatus = errorMessage
    ? 'error'
    : touched
    ? error
      ? 'error'
      : 'success'
    : undefined;

  const ABC = () => (
    <Row>
      <Col span={24}>
        <Form.Item
          {...(customFormProps || {})}
          hasFeedback
          label={label}
          // hasFeedback={Boolean(errorMessage || error)}
          className={`ant-form-item-${inputType}`}
          labelCol={{ span: 24 }}
          help={
            errorMessage
              ? t(errorMessage)
              : touched && t(errorMessage || error || '')
          }
          validateStatus={validateStatus}
        >
          <UncontrollInput
            inputType={inputType}
            {...rest}
            {...field}
            onBlur={onBlur}
            onChange={replaceOnChange as any}
            // name={name}
          />
        </Form.Item>
      </Col>
    </Row>
  );
  return (
    <div ref={inputRef} className={`form-item-container ${className}`}>
      {isFastField ? (
        <FastField
          {...rest}
          name={name}
          onBlur={onBlur}
          onChange={replaceOnChange as any}
        >
          {ABC}
        </FastField>
      ) : (
        <Field name={name}>{ABC}</Field>
      )}
    </div>
  );
};

export default memo(ControlledInputHasTopLabel);
