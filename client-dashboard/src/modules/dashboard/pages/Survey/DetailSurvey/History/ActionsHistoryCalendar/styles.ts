import styled from 'styled-components/macro';

export const MonthWrapper = styled.div<{ height: number }>`
  font-size: 12px;
  font-weight: 600;
  height: ${p => p.height}px;
  padding: 10px;
  text-align: center;

  .line {
    height: 3px;
    background: gray;
    border-radius: 2px;
  }
`;

export const ThumbWrapper = styled.div`
  position: absolute;
  width: 50px;
  height: 124px;
  cursor: pointer;
  z-index: 10;
  background-color: rgb(0, 122, 231, 0.08);
  border-radius: 4px;
  top: 0;
  &:focus {
    outline: 1px solid;
  }
`;
