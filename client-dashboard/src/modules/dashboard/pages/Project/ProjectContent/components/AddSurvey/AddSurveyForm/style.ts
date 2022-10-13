import styled from 'styled-components';
import { Form } from 'antd';
import templateVariable from '../../../../../../../../app/template-variables.module.scss';
import { screenSize } from '../../../../../../../../enums';

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
    &__questions {
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
