import styled from 'styled-components/macro';
import { screenSize } from 'enums';
import { BaseSectionWrapper } from 'modules/common/styles';

export const ProjectContentWrapper = styled(BaseSectionWrapper)`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .title {
    font-weight: bold;
    margin-bottom: 20px;
  }

  @media only screen and ${screenSize.large} {
    overflow: unset;
  }
`;
