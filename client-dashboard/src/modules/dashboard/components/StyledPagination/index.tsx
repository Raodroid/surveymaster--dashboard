import React, { FC } from 'react';
import styled from 'styled-components/macro';
import { Button, Pagination, PaginationProps } from 'antd';
import { ArrowLeft, ArrowRight } from '@/icons';

const itemRender: PaginationProps['itemRender'] = (
  _,
  type,
  originalElement,
) => {
  if (type === 'prev') {
    return <Button icon={<ArrowLeft />} />;
  }
  if (type === 'next') {
    return <Button icon={<ArrowRight />} />;
  }
  return originalElement;
};

const StyledPagination: FC<PaginationProps> = props => {
  return (
    <StyledPaginationWrapper>
      <Pagination
        {...props}
        itemRender={itemRender}
        showTotal={total => (
          <span>
            Total: <span className={'font-semibold'}>{total}</span>
          </span>
        )}
      />
    </StyledPaginationWrapper>
  );
};

export default StyledPagination;

const StyledPaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  .ant-btn-default,
  .ant-btn:disabled {
    background: transparent !important;
  }
  .ant-pagination {
    margin-top: 0;
    width: 100%;
    display: flex;
    .ant-pagination-prev,
    .ant-pagination-next {
      flex: 1;
    }
    .ant-pagination-prev {
      justify-content: end;
      display: flex;
    }
  }
`;
