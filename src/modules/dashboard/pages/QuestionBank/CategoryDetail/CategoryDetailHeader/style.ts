import styled from 'styled-components/macro';
import templateVariable from '../../../../../../app/template-variables.module.scss';

export const CategoryDetailHeaderWrapper = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${templateVariable.border_color};
  .ant-input-group-wrapper.ant-input-search {
    flex: 1;
    margin-right: 1.5rem;
  }
  .ant-input-affix-wrapper {
    border: 0;
    .ant-input {
      font-size: 14px;
    }
  }
`;
