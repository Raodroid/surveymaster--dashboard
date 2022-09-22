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
    .ant-checkbox-indeterminate .ant-checkbox-inner::after {
      transform: translate(-50%, -50%) scale(1) !important;
      background-image: none !important;
    }
    .ant-table-cell {
      border: none;
    }
  }
  .ant-table-tbody > tr:nth-child(n) {
    background: #f5fafe;
  }
  .ant-table-tbody > tr:nth-child(2n) {
    background: white;
  }
`;
