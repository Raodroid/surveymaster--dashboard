import styled from 'styled-components/macro';
import { DetailQuestionLayoutWrapper } from '../style';

export const ViewQuestionWrapper = styled(DetailQuestionLayoutWrapper)`
  position: relative; //this setting is for HannahCustomSpin

  .version-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
`;
