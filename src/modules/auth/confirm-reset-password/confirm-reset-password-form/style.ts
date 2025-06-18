import styled from 'styled-components/macro';
import templateVariable from '../../../../app/template-variables.module.scss';

export const ConfirmResetPasswordFormRoot = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: ${templateVariable.text_primary_color};

  > p.title {
    margin-top: 2.857rem;
    margin-bottom: 20px;
    font-size: 20px;
  }
  > p.des {
    font-size: 14px;
    text-align: center;
    margin-bottom: 40px;
  }
  button {
    margin-top: 0.571rem;
    width: 100%;
  }
`;
