import styled from 'styled-components';
import templateVariable from '../../../../app/template-variables.module.scss';

export const GeneralSectionHeaderWrapper = styled.div`
  padding: 2rem;
  display: flex;
  align-items: center;

  .GeneralSectionHeader {
    display: flex;

    &__main-section {
      flex: 1;

      &__title {
        display: flex;
        align-items: center;
        .header-section-icon {
          display: flex;
          margin-right: 1.5rem;
          color: ${templateVariable.primary_color};
          cursor: pointer;
        }
        .header-section-title {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
    &__ending-section {
      margin-left: 1.5rem;
    }
  }
`;
