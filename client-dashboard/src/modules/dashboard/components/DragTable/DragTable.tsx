import {Table} from 'antd';
import type {SortableContainerProps, SortEnd} from 'react-sortable-hoc';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {TableProps} from 'antd/lib/table';
import {createContext, FC, HTMLAttributes} from 'react';

export function arrayMoveMutable<Type>(
  array: Type[],
  fromIndex: number,
  toIndex: number,
) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

export function arrayMoveImmutable<Type>(
  array: Type[],
  fromIndex: number,
  toIndex: number,
) {
  const newArray = [...array];
  arrayMoveMutable(newArray, fromIndex, toIndex);
  return newArray;
}

const ThemeContext = createContext<{
  onSortEnd: ({ oldIndex, newIndex }: SortEnd) => void;
  dataSource: any;
  renderRowClassName?: (value: any) => string;
} | null>(null);

const DraggableContainer = (props: SortableContainerProps) => (
  <ThemeContext.Consumer>
    {value => (
      <SortableBody
        useDragHandle
        disableAutoscroll
        helperClass="row-dragging"
        onSortEnd={value?.onSortEnd}
        {...props}
      />
    )}
  </ThemeContext.Consumer>
);

const DraggableBodyRow: FC = ({
  // className,
  style,
  ...restProps
}) => {
  // function findIndex base on Table rowKey props and should always be a right array index
  const currentRecord = restProps.children?.[0]?.props.record;

  return (
    <ThemeContext.Consumer>
      {value => (
        <SortableItem
          index={value?.dataSource?.findIndex(
            x => x['index'] === restProps['data-row-key'],
          )}
          {...restProps}
          className={
            value?.renderRowClassName
              ? value.renderRowClassName(currentRecord)
              : ''
          }
        />
      )}
    </ThemeContext.Consumer>
  );
};

const SortableItem = SortableElement(
  (props: HTMLAttributes<HTMLTableRowElement>) => {
    return <tr {...props} />;
  },
);
const SortableBody = SortableContainer(
  (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,
);

interface HanhTableProps<RecordType> extends TableProps<RecordType> {
  setDataTable: (value: RecordType[]) => void;
  renderRowClassName?: (value) => string;
}

export const DragTable: FC<HanhTableProps<any>> = props => {
  const {
    dataSource,
    setDataTable,
    renderRowClassName,
    rowClassName,
    ...rest
  } = props;

  const transformDataSource = dataSource?.map((i, index) => ({ ...i, index }));

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        (transformDataSource || []).slice(),
        oldIndex,
        newIndex,
      ).filter(el => !!el);
      setDataTable(newData);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        onSortEnd,
        dataSource: transformDataSource,
        renderRowClassName,
      }}
    >
      <Table
        pagination={false}
        dataSource={transformDataSource}
        rowKey="index"
        {...rest}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
    </ThemeContext.Provider>
  );
};
