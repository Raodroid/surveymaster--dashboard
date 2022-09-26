import styled from 'styled-components';
import { Form } from 'antd';

export const AddQuestionDetailFormWrapper = styled(Form)`
  .QuestionDetailForm {
    &__row {
      display: flex;
      gap: 2rem;
      .form-item-contatiner {
        flex: 1;
      }
    }
  }
`;
