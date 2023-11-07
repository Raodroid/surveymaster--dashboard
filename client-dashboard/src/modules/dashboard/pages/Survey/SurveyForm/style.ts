import styled from 'styled-components/macro';
import { Form } from 'antd';
import { screenSize } from '@/enums';
import templateVariable from '@/app/template-variables.module.scss';

export const SurveyFormWrapper = styled(Form)`
  .SurveyFormWrapper {
    &__survey-info {
      display: flex;
      gap: ${templateVariable.section_spacing};
      &__survey-detail-section {
        flex: 1;
      }

      .divider {
        border-color: ${templateVariable.border_color};
        border-style: solid;
        border-right-width: 1px;
      }

      &__params-section {
        width: 284px;
      }
    }
    &__submit_btn {
      width: calc(100% - 80px);
      position: absolute;
      bottom: 0;
      background: white;
      padding: 1.5rem 0;
      .ant-btn {
        width: 100%;
      }
    }
  }

  @media only screen and ${screenSize.large} {
    .SurveyFormWrapper {
      &__survey-info {
        flex-direction: column;

        .divider {
          border-right-width: 0;
          border-bottom-width: 1px;
        }

        &__params-section {
          flex: 1;
          width: auto;
        }
      }
    }
  }
`;

export const QuestionListWrapper = styled.div`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: ${templateVariable.section_spacing};

  .ant-table-cell {
    .ant-form-item {
      margin-bottom: 0 !important;
    }
  }

  .QuestionListWrapper {
    &__header {
      font-weight: bold;
    }
    &__body {
    }
    &__footer {
      gap: 20px;
      margin-bottom: 20px;

      .ant-btn {
        flex: 1;
      }
    }
  }
`;

export const TemplateOptionWrapper = styled.div`
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
