import styled from 'styled-components/macro';
import { Button } from 'antd';
export const ProjectFilterBtn = styled(Button)`
  padding: 2px;
  padding-left: 12px;
  gap: 4px;
  border-radius: 4px;

  > svg {
    color: white;
  }

  .counter {
    margin-left: 8px;
    width: 44px;
    height: 28px;
    border-radius: 2px;
    background: white;
    color: var(--text-color);
    gap: 4px;
    font-size: 12px;
    font-weight: 600;

    svg {
      width: 9px;
    }
  }
`;
