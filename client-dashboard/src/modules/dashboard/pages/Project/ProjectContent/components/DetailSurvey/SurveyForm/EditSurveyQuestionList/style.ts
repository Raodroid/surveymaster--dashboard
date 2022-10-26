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

export const UploadExternalFileWrapper = styled.div`
  .display-file-data {
    width: 100%;
    border-radius: 8px;
    border: 2px solid ${templateVariable.info_color};
    height: 300px;
    padding: 3rem 3rem 0 3rem;
    overflow: hidden;

    &__table {
      display: flex;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12);
      border: 1px solid rgb(0 0 0 / 8%);

      &__column {
        flex: 1;
        display: flex;
        flex-direction: column;

        &:nth-child(2n + 1) {
          background: rgb(37 33 106 / 6%);
        }
      }

      &__cell {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        font-size: 12px;
        font-weight: 600;

        &:nth-child(2n + 1) {
          background: rgb(37 33 106 / 6%);
        }
      }
    }
  }

  .ant-upload.ant-upload-drag {
    height: 300px;
    background: rgba(0, 122, 231, 0.2);
    border-width: 2px;

    .ant-upload-hint {
      margin: 2rem auto;
    }

    .ant-btn {
      margin: 0 auto;
      width: 210px;
    }
  }
`;
