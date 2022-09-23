import React, { FC } from 'react';
import styled from 'styled-components';
import { Pagination, PaginationProps } from 'antd';

const StyledPagination: FC<PaginationProps> = props => {
  return (
    <StyledPaginationWrapper>
      <Pagination {...props} />
    </StyledPaginationWrapper>
  );
};

export default StyledPagination;

const StyledPaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem;
`;
