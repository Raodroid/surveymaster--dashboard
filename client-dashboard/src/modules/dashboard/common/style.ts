import styled from 'styled-components';
import { Layout } from 'antd';
import { MAX_SCREEN_WIDTH } from '../../../enums';
import templateVariable from '../../../app/template-variables.module.scss';
const { Content } = Layout;

export const UserDashBoardContentWrapper = styled(Content)`
  /* margin: 1rem auto; */
  /* padding: 0 1rem; */
  max-width: calc(${MAX_SCREEN_WIDTH} + 2rem);
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  & > .go-back-bar {
    display: flex;
    padding: 0.786rem 1.5rem;
    background: white;
    border-radius: ${templateVariable.border_radius};
    font-weight: 600;
    color: ${templateVariable.text_primary_color};
    & > .btn-come-back {
      font-size: 14px;
      position: relative;
      width: max-content;
      padding: 0.714rem 1.143rem;
      transition: 0.3s;
      span:nth-child(1) {
        margin-right: 1.5rem;
        cursor: pointer;
      }
      &:hover {
        border-radius: 6px;
        background: rgba(35, 37, 103, 0.04);
        cursor: pointer;
      }
    }
  }
  .left-side-menu {
    width: 325px;
    border-radius: 8px;
    background-color: #ffffff;
    padding: 1rem;
    margin-right: 2rem;
    margin-bottom: 2rem;
    & > .go-back-bar {
      border-radius: 0;
      padding-top: 8px;
      margin-bottom: 1rem;
      &:hover {
        background: rgba(35, 37, 103, 0.04);
      }
    }
    .program-item {
      .program-img {
        height: 100px;
      }
    }

    @media only screen and (max-width: 780px) {
      width: 100%;
      .program-item {
        .program-img {
          height: 200px;
        }
      }
    }
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 10px 0;
  .input-name {
    color: ${templateVariable.text_primary_color};
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 5px;
    margin-left: 10px;
  }
`;

export const CancelOKGroupBtn = styled.div`
  display: flex;
  align-items: center;
  .cancel-btn {
    margin-right: 10px;
  }
`;

export const ClickableItemWrapper = styled.span`
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-left: 3.5rem;
  span:last-child {
    margin-left: 5px;
  }
  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

export const GroupActionBtn = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  position: absolute;
  right: 5px;
  top: 0;
  bottom: 0;
  .preview-btn {
    margin-right: 10px;
  }
`;
