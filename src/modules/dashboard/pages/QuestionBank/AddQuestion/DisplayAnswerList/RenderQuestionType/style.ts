import styled from 'styled-components/macro';
import templateVariable from '@/app/template-variables.module.scss';

export const AnswerListWrapper = styled.div`
  .drag-icon-wrapper {
    display: inline-flex;
    gap: 1.5rem;
    align-items: center;
    margin-left: 1rem;
    .title {
      font-size: 12px;
      font-weight: 600;
    }
  }
  .ant-form-item-control {
    > div {
      &:last-child {
        display: none !important;
      }
    }
  }
  .trash-icon {
    color: ${templateVariable.primary_color};
    cursor: pointer;
    :hover {
      color: ${templateVariable.primary_color_hover};
    }
  }
`;
