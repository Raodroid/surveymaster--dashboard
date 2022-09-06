import { Row, Col } from 'antd';
import styled from 'styled-components';
import { screenSize } from '../../../enums/screenSize';

export const CustomRow = styled(Row)`
  width: 100%;
  display: flex;
`;
export const CustomCol = styled(Col)`
  width: 100%;
  display: flex;
`;

export const LeftHeader = styled.div`
  width: calc(100% - 150px);
  .anticon-left-circle,
  svg {
    width: 31px;
    height: 31px;
    color: white;
  }
  p {
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 0;
  }
  .sub-title {
    line-height: 20px;
    text-transform: uppercase;
    opacity: 0.5;
  }
  .main-title {
    font-size: 32px;
    line-height: 40px;
    letter-spacing: -0.02em;
  }
`;

export const RightHeader = styled.div`
  width: 150px;
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  .col {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
  }
  .sm {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    opacity: 0.7;
  }
  .noti {
    background: #ffffff;
    border-radius: 48px 0 0 48px;
    margin-left: 16px;
  }
`;
export const MenuIconSpacing = styled.div<{ isSmall: boolean }>`
  /* width: ${props => (props.isSmall ? 49 : 14)}px; */
  width: 0;
`;
export const MobileHeaderWrapper = styled.div`
  width: 100%;
  .row01 {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .col02 {
      .col {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
      }
      .noti {
        position: relative;
        background: #ffffff;
        border-radius: 48px 0 0 48px;
        margin-left: 16px;
        background-repeat: no-repeat;
        background-size: 16px;
        background-position: center;
        svg {
          margin: auto;
          height: 16px;
          width: 16px;
        }
      }
    }
    .col01 {
      display: flex;
      justify-content: center;
      width: 100%;
      flex-wrap: wrap;
      align-content: center;
      @media only screen and ${screenSize.medium} {
        transform: translate(-37px, 0px);
      }
      @media only screen and ${screenSize.small} {
        transform: none;
      }
      .back-icon {
        margin-right: 16px;
        margin-top: 14px;
        cursor: pointer;
      }
      .anticon-left-circle,
      svg {
        width: 31px;
        height: 31px;
        color: white;
      }
      .title-wrapper {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: calc(100vw - 120px);
        /* @media only screen and (max-width: 350px) {
          width: calc(100vw - 100px);
        } */
        p {
          text-align: center;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0;
        }
        .sub-title {
          font-size: 14px;
          line-height: 16px;
          text-transform: uppercase;
          opacity: 0.5;
        }
        .main-title {
          font-size: 24px;
          line-height: 32px;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
        }
      }
      .more-info-title {
        margin-top: 5px;
      }
      span {
        margin: 0 5px;
        color: #ffffff;
      }
      .header-group-button {
        flex: 1;
        display: flex;
        align-items: flex-end;
        .current-status-tag {
          flex: 1;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
        .batch-status {
          color: #fff;
        }
        .inner-group-btn {
          display: flex;
          justify-content: flex-end;
          flex: 1;
        }
        @media only screen and (max-width: 852px) {
          justify-content: flex-start;
          margin-left: 46px;
        }
      }
    }
  }
`;

export const HeaderGroupButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
