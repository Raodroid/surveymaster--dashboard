import styled from 'styled-components';
import { Layout } from 'antd';
import templateVariable from '../../../../app/template-variables.module.scss';
import { screenSize } from '../../../../enums';
const { Content } = Layout;

export const ProjectWrapper = styled(Content)`
  display: flex;
  gap: ${templateVariable.section_spacing};
  background: none;

  height: 100%;

  @media only screen and (${screenSize.medium}) {
    flex-direction: column;
  }

  section:last-child {
    display: flex;
    flex-direction: column;
  }

  .ant-table-row,
  .ant-table-thead {
    height: 48px;
  }
  .ant-table-cell {
    font-weight: 600;
    &::before {
      display: none;
    }
  }
  .ant-table-body {
    overflow-y: auto !important;
  }
  .ant-table-thead {
    .ant-table-cell {
      border: none;
    }
  }

  .height-100 {
    height: 100%;
  }
  .overflow-hidden {
    overflow-y: hidden;
  }
`;
