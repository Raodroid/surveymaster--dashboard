import styled from 'styled-components';

export const AddProjectWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;

  .ant-form {
    height: 100%;
    overflow-y: auto;
    padding: 40px;
  }

  label {
    padding-left: 4px;
  }

  .footer {
    padding: 20px 0;
    border-top: 1px solid #f3eef3;

    position: absolute;
    bottom: 0;
    right: 40px;
    left: 40px;
    background: white;

    .ant-btn {
      width: 100%;
      height: 36px;
    }
  }
`;

export const AddProjectContentWrapper = styled.div``;

export const InputsWrapper = styled.div`
  border-bottom: 1px solid #f3eef3;
  padding-bottom: 4px;

  display: grid;
  grid-template-columns: 2fr 1px 1fr;
  column-gap: 40px;
  grid-template-areas:
    'mainInfo-title divider projParams'
    'projTitle      divider projId'
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

export const EditProjectWrapper = styled.div`
  flex: 1;

  .ant-spin-nested-loading {
    flex: 1;
  }

  .ant-spin-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;
