import {memo} from 'react';
import {Rate} from 'antd';
import {RateProps} from 'antd/lib/rate';
import {OnchangeType} from '../../type';

export type CustomRatingProps = RateProps & OnchangeType;

const Rating = (props: CustomRatingProps) => {
  const customOnChange = (value: number) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };
  const customProps: { onChange?: typeof customOnChange } = {};
  if (props.onChange) customProps.onChange = customOnChange;

  return <Rate {...props} {...customProps} aria-label="Rating" />;
};

export default memo(Rating);
