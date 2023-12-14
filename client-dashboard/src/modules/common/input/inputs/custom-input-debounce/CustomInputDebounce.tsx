import {ChangeEvent, memo, useCallback, useMemo, useRef} from 'react';
import {Input} from 'antd';
import {InputProps} from 'antd/lib/input';
import {OnchangeType} from '../../type';
import debounce from 'lodash/debounce';

export type CustomInputProps = InputProps & OnchangeType;

const CustomInputDebounce = (props: CustomInputProps) => {
  const a = useRef<any | undefined>();
  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      if (props.onChange) {
        props.onChange(value);
      }
    }, 400),
    [],
  );

  const customOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(e.target.value);
  };

  const customProps = useMemo(() => {
    const { value, ...restProps } = props;

    restProps.autoFocus = true;

    restProps['defaultValue'] = value;

    if (props.onChange) restProps.onChange = customOnChange;
    return { ...restProps };
  }, [customOnChange, props]);

  return (
    <Input
      ref={a}
      aria-label={'Custom Input Debounce'}
      formNoValidate
      {...customProps}
      key={customProps['defaultValue'] as string}
      autoComplete="chrome-off"
    />
  );
};
export default memo(CustomInputDebounce);
