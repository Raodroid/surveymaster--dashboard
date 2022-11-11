import styled from 'styled-components';
import templateVariable from '../../../../../../app/template-variables.module.scss';

export const CategoryDetailHeaderWrapper = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${templateVariable.border_color};

  .search-input {
    flex: 1;
    margin-right: 1rem;
    border: 0;
    box-shadow: none;
    .ant-input {
      font-size: 16px;
      width: min(400px, 100%);
    }
    .ant-input-prefix {
      color: ${templateVariable.primary_color};
      margin-right: 1rem;
    }
  }
`;
