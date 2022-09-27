import styled from 'styled-components';
import { Form } from 'antd';

export const DisplayAnswerListWrapper = styled(Form)`
  .DisplayAnswerListWrapper {
    &__row {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      &__first {
        width: 100px;
      }
      &__second {
        flex: 1;
      }
      .delete-icon {
      }
    }
  }
`;
