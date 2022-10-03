import styled from 'styled-components';
import { Form } from 'antd';
import templateVariable from '../../../../../../app/template-variables.module.scss';

export const DisplayAnswerListWrapper = styled(Form)`
  .DisplayAnswerListWrapper {
    &__row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 4px;

      &:nth-child(2n) {
        background: rgb(245 250 254);
      }

      &__first {
        width: 50px;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        span {
          font-weight: 600;
          font-size: 12px;
        }
      }

      &__second {
        flex: 1;

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

      .delete-icon {
      }
    }
  }
`;
