import styled from 'styled-components/macro';

export const InputsWrapper = styled.div`
  height: 100%;
  overflow: scroll;
  //border-bottom: 1px solid #f3eef3;
  padding-bottom: 4px;
  display: grid;
  grid-template-columns: 2fr 1px 1fr;
  column-gap: 40px;
  grid-template-areas:
    'mainInfo-title divider projParams'
    'projTitle      divider projId'
    'projType       divider personInCharge'
    'projDesc       divider personInCharge';
  .mainInfo-title {
    grid-area: mainInfo-title;
  }
  .projParams {
    grid-area: projParams;
  }
  .divider {
    grid-area: divider;
    height: calc(100% - 24px);
    width: 1px;
    margin: auto;
    margin-top: 0;
  }
  .projTitle {
    grid-area: projTitle;
  }
  .projId {
    grid-area: projId;
  }
  .projType {
    grid-area: projType;
  }
  .projDesc {
    grid-area: projDesc;
    textarea {
      height: 108px;
    }
  }
  .personInCharge {
    grid-area: personInCharge;
  }
`;
