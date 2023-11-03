import styled from 'styled-components/macro';

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  .form-item-container {
    &:first-child {
      flex: 1;
    }
    &:last-child {
      flex: 4;
    }
  }
`;
