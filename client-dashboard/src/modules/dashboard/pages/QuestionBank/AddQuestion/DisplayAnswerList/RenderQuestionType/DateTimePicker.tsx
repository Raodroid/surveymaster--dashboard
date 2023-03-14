import { Table } from 'antd';
import React, { FC, useMemo } from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import { useTranslation } from 'react-i18next';
import { DateFormat, IOptionItem, TimeFormat } from 'type';
import { transformEnumToOption } from 'utils';
import { useField } from 'formik';

const DateTimePicker: FC<{
  type: 'Time' | 'Date';
}> = props => {
  const { type } = props;
  const { t } = useTranslation();
  const [, meta, helpers] = useField(
    type === 'Time' ? 'timeFormat' : 'dateFormat',
  );
  const { value } = meta;
  const { setValue } = helpers;

  const columns = useMemo<ColumnsType<IOptionItem>>(
    () => [
      {
        title: t('common.option'),
        dataIndex: 'value',
        render: (value, record) => record.label,
      },
    ],
    [t],
  );

  const data = useMemo(
    () =>
      transformEnumToOption(type === 'Time' ? TimeFormat : DateFormat, type =>
        t(`timeFormat.${type}`),
      ),
    [type, t],
  );

  return (
    <div>
      <Table
        rowSelection={{
          type: 'radio',
          onChange: (selectedRowKeys: React.Key[]) => {
            setValue(selectedRowKeys[0]);
          },
          selectedRowKeys: [value],
        }}
        columns={columns}
        dataSource={data}
        rowKey={record => record.value}
        pagination={false}
      />
    </div>
  );
};

export default DateTimePicker;
