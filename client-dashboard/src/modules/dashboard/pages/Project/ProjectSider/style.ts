import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';
import { screenSize } from '../../../../../enums';
import templateVariable from 'app/template-variables.module.scss';
import { Button } from 'antd';

export const ProjectSiderWrapper = styled(BaseSectionWrapper)`
  width: 290px;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  @media only screen and (${screenSize.medium}) {
    width: 100%;
  }

  .list {
    flex: 1;
    overflow-y: auto;
    .ant-spin-nested-loading {
      flex: 1;
    }
    .simplebar-content {
      padding: 0 1.5rem !important;
    }
  }
  .add-new-project-btn-wrapper {
    padding: 16px;
    padding-bottom: 0;
    border-top: 1px solid #f3eef3;
    .ant-btn {
      border-radius: 6px;
      width: 100%;
      height: 40px;
      box-shadow: none;

      span {
        font-size: 14px;
        font-weight: bold;
        color: ${templateVariable.text_primary_color};
      }
    }
  }
  .new-project-btn {
    gap: 12px;
  }
`;

export const TitleStyled = styled.div`
  .ant-btn {
    justify-content: flex-start;
    box-shadow: none;
    border-radius: 6px;
    height: unset;
    span {
      color: ${templateVariable.text_primary_color};
      line-height: 16px;
      text-align: left;
      white-space: normal;
    }
    .primary {
      color: white;
    }
  }
  .title-btn {
    padding: 12px;
    margin-bottom: 4px;
    width: 100%;
    min-height: 40px;
    &:not(.active) {
      background: white;
    }
    &:hover {
      background: var(--ant-primary-color-deprecated-l-35);
    }
    span {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .active {
    background: #fbf0f7;
  }
  .wrapper {
    height: 76px;
    gap: 4px;
    flex-direction: column;
    padding: 4px;
    margin-bottom: 4px;
    transition: all linear 0.1s;
    overflow: hidden;

    .ant-btn {
      width: 100%;
      min-height: 32px;
      gap: 12px;

      &:last-child {
        svg {
          background: transparent;
          path {
            fill: var(--ant-primary-color);
          }
        }
        &:focus {
          background: #fbf0f7;
        }
      }
    }
    .ant-btn-default {
      font-weight: 600;
      span {
        margin: 0;
      }
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
  .hide {
    height: 0;
    padding: 0 4px;
    margin: 0;
    opacity: 0;
  }
  .primary span {
    color: white;
  }
`;

export const AddNewProjectBtn = styled(Button)`
  &:focus {
    background: var(--ant-primary-color-deprecated-f-12);
  }
`;

export const TemplateOptionWrapper = styled.div`
  .duplicate {
  }
  .survey-dropdown {
    height: 250px;
    overflow: scroll;
    position: relative;
    padding: 0 2rem 0 3rem;
  }
  .infinity-scroll {
    position: absolute;
    top: 32px;
    width: calc(100% - 5rem);
  }
`;
