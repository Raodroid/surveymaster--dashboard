import styled from 'styled-components';
import { Layout } from 'antd';
import templateVariable from 'app/template-variables.module.scss';
import { screenSize } from 'enums';
import { BaseSectionWrapper } from 'modules/common/styles';

export const ProjectContentWrapper = styled(BaseSectionWrapper)`
  width: 100%;
  overflow: hidden;
  flex: 1;
  padding: 0;
  .title {
    font-weight: bold;
    margin-bottom: 20px;
  }

  @media only screen and ${screenSize.large} {
    overflow: unset;
  }
`;

const { Content } = Layout;

export const ProjectWrapper = styled(Content)`
  display: flex;
  gap: ${templateVariable.section_spacing};
  background: none;

  height: 100%;
  width: 100%;

  section:last-child {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .ant-table-cell {
    &::before {
      display: none;
    }
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
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .ant-input-disabled,
  .ant-input-affix-wrapper-disabled {
    cursor: default;
  }

  @media only screen and (${screenSize.medium}) {
    flex-direction: column;
    section:last-child {
      overflow: unset;
    }
  }
`;
