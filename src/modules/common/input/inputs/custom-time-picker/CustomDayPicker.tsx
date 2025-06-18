import {memo} from 'react';
import {DatePicker} from 'antd';

import {DATE_PICKER_TYPES, MOMENT_FORMAT} from 'enums';

const CustomDayPicker = props => {
  const { picker, format, isEditFormat } = props;

  const formatDate = {
    [DATE_PICKER_TYPES.MONTH]: MOMENT_FORMAT.MONTH_FORMAT,
    [DATE_PICKER_TYPES.DATE]: MOMENT_FORMAT.DOB,
  };

  return (
    <DatePicker
      {...props}
      format={formatDate[picker] || MOMENT_FORMAT.FULL_DATE_FORMAT}
      style={{ width: '100%' }}
    />
  );
};

export default memo(CustomDayPicker);
