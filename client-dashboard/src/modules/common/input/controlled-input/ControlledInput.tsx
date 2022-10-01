import React, { memo, useCallback, useEffect, useRef } from 'react';
import { FastField, Field, useField } from 'formik';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import UncontrollInput from '../uncontrolled-input/UncontrollInput';
import { ControlledInputProps } from '../type';

const ControlledInput = (props: ControlledInputProps) => {
  const {
    isFastField = true, //This has to be false if Question is a condition question
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
    const handleClick = () => setValue('');
    const elm = inputRef.current.querySelector(
      'div.form-item-contatiner .anticon-close-circle',
    );
    elm?.addEventListener('click', handleClick);

    return () => {
      elm?.removeEventListener('click', handleClick);
    };
  });

  const replaceOnChange = (
    value: string | number,
    option: { value: string | number; label: string },
  ) => {
    if (!isOptionValue) {
      onChange && onChange(value);
      setValue(value);
    } else setValue(option);
  };

  const validateStatus = errorMessage
    ? 'error'
    : touched
    ? error
      ? 'error'
      : 'success'
    : undefined;

  const ABC = () => (
    <Form.Item
      {...(customFormProps || {})}
      label={label}
      hasFeedback
      // hasFeedback={Boolean(errorMessage || error)}
      className={`ant-form-item-${inputType}`}
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
        onBlur={e => {
          if (rest.onBlur) {
            rest.onBlur(e);
          }
          field.onBlur(e);
        }}
        onChange={replaceOnChange as any}
        // name={name}
      />
    </Form.Item>
  );
  return (
    <div ref={inputRef} className={`form-item-container ${className}`}>
      {isFastField ? (
        <FastField name={name}>{ABC}</FastField>
      ) : (
        <Field name={name}>{ABC}</Field>
      )}
    </div>
  );
};

export default memo(ControlledInput);
