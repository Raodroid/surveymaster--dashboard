import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';
import { screenSize } from '../../../../../enums';

export const ProjectSiderWrapper = styled(BaseSectionWrapper)`
  width: 290px;
  padding: 16px;

  @media only screen and (${screenSize.medium}) {
    width: 100%;
  }
`;
