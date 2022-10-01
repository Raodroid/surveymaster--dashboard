import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';

export const FlexBox = styled(BaseSectionWrapper)`
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .flex-start {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .flex-column {
    display: flex;
    flex-direction: column;
  }
  .flex-aligns-start {
    display: flex;
    align-items: flex-start;
  }
`;

export const ProjectContentWrapper = styled(FlexBox)`
  flex: 1;
  padding: 0;

  .title {
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

export const HeaderStyled = styled.div`
  height: 76px;
  padding: 0 32px;
  border-bottom: 1px solid #f3eef3;

  .breadcrumb {
    border-top: none;
    span,
    a {
      font-size: 16px;
    }
  }

  .breadcrumb-item span {
    color: var(--text-color);
  }

  svg {
    color: var(--ant-primary-color);
  }
`;

export const ProjectTableWrapper = styled.div`
  padding: 20px 12px 16px;
  height: 100%;
  overflow-y: auto;

  .ant-table-cell:last-child {
    text-align: center;
  }
`;
