import React from 'react';

import { Table } from 'antd';

import { arrayMoveImmutable } from 'array-move';

import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { TableProps } from 'antd/lib/table';

const SortableItem = SortableElement(
  (props: React.HTMLAttributes<HTMLTableRowElement>) => {
    return <tr {...props} />;
  },
);
const SortableBody = SortableContainer(
  (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props} />
  ),
);
export const DragTable: React.FC<
  TableProps<any> & {
    setDataTable: (value) => void;
    renderRowClassName?: (value) => string;
  }
> = props => {
  const {
    dataSource,
    setDataTable,
    renderRowClassName,
    rowClassName,
    ...rest
  } = props;
  // const [dataSource, setDataTable] = useState<any>([]);

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        (dataSource || []).slice(),
        oldIndex,
        newIndex,
      ).filter(el => !!el);
      setDataTable(newData);
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({
    // className,
    style,
    ...restProps
  }) => {
    // function findIndex base on Table rowKey props and should always be a right array index

    const index = dataSource?.findIndex(
      x => x['index'] === restProps['data-row-key'],
    );
    const currentRecord = restProps.children?.[0]?.props.record;
    if (renderRowClassName) console.log(renderRowClassName(currentRecord));

    return (
      <SortableItem
        index={index}
        {...restProps}
        className={renderRowClassName ? renderRowClassName(currentRecord) : ''}
      />
    );
  };

  return (
    <Table
      pagination={false}
      dataSource={dataSource}
      rowKey="index"
      {...rest}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  );
};
