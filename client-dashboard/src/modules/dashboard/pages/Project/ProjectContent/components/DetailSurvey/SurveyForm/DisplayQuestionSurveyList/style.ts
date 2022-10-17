import styled from 'styled-components';
import templateVariable from '../../../../../../../../../app/template-variables.module.scss';

export const DisplayQuestionSurveyListWrapper = styled.div`
  .DisplayQuestionSurveyListWrapper {
    &__row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 4px;

      &:nth-child(2n) {
        background: rgb(245 250 254);
      }

      &.title-column {
        .second {
          .question-info-wrapper {
            align-items: center;
            .category,
            .question-type {
              margin: 0;
            }
          }
        }
      }

      &__item {
        span {
          font-weight: 600;
          font-size: 12px;
        }
        .ant-form-item-explain {
          display: none;
        }
        .ant-form-item-control {
          > div {
            &:last-child {
              display: none !important;
            }
          }
        }
      }

      .first {
        width: 50px;
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .second {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        .question-info-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          .question {
            width: 60%;
            .question-label-info {
              display: flex;
              align-items: center;
              gap: 5px;
              margin-bottom: 6px;
            }
            .status-question {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              display: inline-block;
              &.success-color {
                background: #00ab00;
              }
              &.warning-color {
                background: #ff634e;
              }
            }
            .decline-change-btn,
            .show-history-btn {
              display: flex;
              gap: 0.5rem;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              align-items: center;
              color: ${templateVariable.primary_color};
              :hover {
                color: ${templateVariable.primary_color_hover};
              }
            }
            .show-history-btn {
              padding-top: 1rem;
            }
          }
          .category {
            width: 40%;
            height: fit-content;
            margin-top: 25px;
          }
          .question-type {
            width: 150px;
            height: fit-content;
            margin-top: 25px;
            > div:nth-child(1) {
              width: 100%;
            }
          }
        }
      }
      .third {
        width: 300px;
      }
      .forth {
        width: 30px;
      }
    }
  }
`;
