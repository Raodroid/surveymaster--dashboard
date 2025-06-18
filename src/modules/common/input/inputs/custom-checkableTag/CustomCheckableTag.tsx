import {memo, useCallback} from 'react';
import {CheckableTagCustomized} from './styles';

const CustomCheckableTag = props => {
  const {
    callback,
    options,
    multiple,
    allowClear,
    value: originalValue,
    onChange,
    ...rest
  } = props;

  const value = multiple
    ? Array.isArray(originalValue)
      ? originalValue
      : []
    : originalValue
    ? originalValue
    : undefined;

  const handleChange = useCallback(
    (valueItem, checked) => {
      if (!multiple) {
        onChange(!checked ? (!allowClear ? valueItem : undefined) : valueItem);
      } else {
        onChange(
          checked
            ? [...value, valueItem]
            : !allowClear && value.length === 1
            ? value
            : value.filter(t => t !== valueItem),
        );
      }
      if (callback) {
        callback();
      }
    },
    [allowClear, multiple, onChange, value],
  );

  return (
    <>
      {options &&
        options.map(option => (
          <CheckableTagCustomized
            {...rest}
            key={option.value}
            checked={
              multiple && Array.isArray(value) && value.length
                ? value.includes(option.value as never)
                : value === option.value
            }
            onChange={checked => handleChange(option.value, checked)}
          >
            {option.label}
          </CheckableTagCustomized>
        ))}
    </>
  );
};

export default memo(CustomCheckableTag);
