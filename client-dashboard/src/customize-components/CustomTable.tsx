import {Table} from 'antd';
import _get from 'lodash/get';
import styled from 'styled-components/macro';
import {TableProps} from 'antd/lib/table';
import useWindowSize from 'modules/common/hoc/useWindowSize';
import {tableSizeResponsive} from 'enums/screenSize';
import {FC} from 'react';

interface TableCustomProps {
  pointer?: boolean;
}

const RootStyled = styled.div`
  tr.deleted-item {
    text-decoration: line-through;
    text-decoration-color: 'rgb(243, 43, 61)';
  }
`;

const CustomTable: FC<TableCustomProps & TableProps<any>> = props => {
  const { pointer, rowClassName } = props;
  const { sizeType } = useWindowSize();
  const size = props.size || tableSizeResponsive[sizeType];

  return (
    <RootStyled>
      <Table
        size={size}
        {...props}
        rowClassName={(record, idx, ident) => {
          let strClassName = idx % 2 === 0 ? 'even-row' : 'odd-row';
          const status = _get(record, 'status', '');
          if (['success', 'danger', 'warning'].includes(status)) {
            strClassName += ` ${status}`;
          }
          if (pointer) {
            strClassName = `${strClassName} row-pointer`;
          }
          if (rowClassName && typeof rowClassName === 'function') {
            strClassName = `${strClassName} ${rowClassName(
              record,
              idx,
              ident,
            )}`;
          }
          return strClassName;
        }}
      />
    </RootStyled>
  );
};

export default CustomTable;
