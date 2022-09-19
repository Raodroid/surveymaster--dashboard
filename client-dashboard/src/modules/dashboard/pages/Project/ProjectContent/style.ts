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
`;

export const ProjectContentWrapper = styled(FlexBox)`
  flex: 1;
  padding: 0;
`;

export const HeaderStyled = styled.div`
  height: 76px;
  padding: 0 32px;
  border-bottom: 1px solid #f3eef3;

  .breadcrumb {
    border-top: none;
  }
`;

export const ProjectTableWrapper = styled.div``;
