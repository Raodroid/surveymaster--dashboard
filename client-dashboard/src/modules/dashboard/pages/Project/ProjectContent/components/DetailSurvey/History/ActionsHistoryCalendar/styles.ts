import styled from 'styled-components';

export const ActionsHistoryCalendarContentWrapper = styled.div`
  gap: 24px;
  min-height: 478px;
  max-height: min(1200px, calc(100vh - 440px));
`;

export const CalendarScrollbarWrapper = styled.div`
  width: 60px;
  overflow: hidden;

  .form-item-container {
    width: 100%;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    .ant-input-affix-wrapper {
      width: 52px;
      height: 24px;
      border: none;
      border-radius: 8px;
    }
  }

  .input-wrapper {
    height: 24px;
  }

  .ant-input-disabled {
    border: none;
    padding: 0;
    height: 24px;
    text-align: center;
    margin: 0 auto;
  }

  .ant-input-affix-wrapper {
    width: 100%;
    padding: 0 0 0 4px;
    .ant-input-disabled {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .calendar-wrapper {
    gap: 4px;
  }

  .ant-col.ant-form-item-control > div:last-child {
    display: none !important;
  }
`;

export const MonthsWrapper = styled.div`
  position: relative;
  overflow: hidden;

  .months {
    position: relative;
  }
`;

export const MonthWrapper = styled.div<{ height: number }>`
  font-size: 12px;
  font-weight: 600;
  height: ${p => p.height}px;
  padding: 0 16px;
  text-align: center;

  .line {
    height: 3px;
    background: gray;
    border-radius: 2px;
  }
`;

export const ThumbWrapper = styled.div`
  position: absolute;
  width: 60px;
  height: 124px;
  cursor: pointer;
  z-index: 10;
  background-color: rgb(0, 122, 231, 0.08);
  border-radius: 4px;

  &::after,
  &::before {
    content: '';
    width: 100%;
    background: rgba(255, 255, 255, 0.8);
    height: max(90vh, 500px);
    position: absolute;
  }

  &::before {
    bottom: 124px;
  }

  &::after {
    top: 124px;
  }
`;
