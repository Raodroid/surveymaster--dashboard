import styled from 'styled-components';
import { BaseSectionWrapper } from '../../../../common/styles';
import { screenSize } from '../../../../../enums';
import templateVariable from 'app/template-variables.module.scss';

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
    padding: 0 1.5rem;
  }
  .add-new-project-btn-wrapper {
    padding: 16px;
    padding-bottom: 0;
    border-top: 1px solid #f3eef3;
    .ant-btn {
      border-radius: 6px;
      width: 100%;
      height: 40px;
      span {
        font-size: 14px;
        font-weight: bold;
        color: ${templateVariable.text_primary_color};
      }
    }
    svg {
      background: var(--ant-primary-color);
      path {
        fill: white;
      }
    }
  }
  svg {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    padding: 3px;
    margin-right: 12px;
  }
`;

const FlexBox = styled.div`
  .flex {
    display: flex;
    align-items: center;
  }

  .flex-center {
    display: flex;
    algin-items: center;
    justify-content: center;
  }
`;

export const TitleStyled = styled(FlexBox)`
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

      svg {
        background: white;
        path {
          fill: var(--ant-primary-color);
        }
      }

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
