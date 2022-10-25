import styled from 'styled-components';
import templateVariable from '../../../../../../../../../app/template-variables.module.scss';

export const DisplayQuestionSurveyListWrapper = styled.div`
  .DisplayQuestionSurveyListWrapper {
    &__row {
      display: flex;
      gap: 1.5rem;
      padding: 1rem 1.5rem;
      border-radius: 4px;

      &:nth-child(2n) {
        background: rgb(245 250 254);
      }

      &.title-column {
        .first,
        .third {
          margin: 0;
          display: block;
        }
        .second {
          .question-info-wrapper {
            align-items: center;
            .question,
            .category,
            .question-type {
              margin: 0;
              //margin-top: 25px;
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

      .first,
      .forth {
        display: flex;
        &.marginTop {
          margin-top: 25px;
        }
      }

      .first {
        width: 100px;
        gap: 1.5rem;
        justify-content: center;
        svg {
          transform: translateY(4px);
        }
      }
      .second {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        &.marginTop {
          .question-info-wrapper {
            .category {
              margin-top: 25px;
            }
            .question-type {
              margin-top: 25px;
            }
          }
        }
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
          }
          .question-type {
            width: 150px;
            > div:nth-child(1) {
              width: 100%;
            }
          }
        }
      }
      .third {
        width: 300px;
        &.marginTop {
          margin-top: 25px;
        }
      }
      .forth {
        width: 30px;
      }
    }
  }
`;
