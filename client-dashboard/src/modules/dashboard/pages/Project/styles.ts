import styled from 'styled-components/macro';
import { Layout } from 'antd';
import templateVariable from 'app/template-variables.module.scss';
import { screenSize } from 'enums';
import { BaseSectionWrapper } from 'modules/common/styles';

export const ProjectContentWrapper = styled(BaseSectionWrapper)`
  width: 100%;
  overflow: hidden;
  .title {
    font-weight: bold;
    margin-bottom: 20px;
  }

  @media only screen and ${screenSize.large} {
    overflow: unset;
  }
`;
