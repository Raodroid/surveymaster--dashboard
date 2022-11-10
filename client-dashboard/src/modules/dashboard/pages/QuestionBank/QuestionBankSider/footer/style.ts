import styled from 'styled-components';

export const QuestionBankSiderFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s;
  :hover {
    background: var(--ant-primary-color-active-deprecated-d-02);
  }
  span {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
  }
`;
