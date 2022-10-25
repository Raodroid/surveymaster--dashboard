import styled from 'styled-components';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LinkOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

const Container = styled.div`
  display: flex;
  button {
    background: transparent;
    padding: 2px !important;
    justify-content: center;
    height: auto !important;
    width: auto !important;
    border-color: transparent;
    box-shadow: none;
    &:visited,
    &:focus {
      border-color: #2162e1 !important;
    }
    :hover {
      cursor: pointer;
    }
    :last-child {
      margin-left: 5px;
    }
  }
`;

const URLColumn = (props: { path: string }) => {
  const { path } = props;
  const { t } = useTranslation();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(path as string);
  }, [path]);
  const handleLinkPage = useCallback(() => {
    window.open(path);
  }, [path]);

  return (
    <Container>
      <Tooltip title={path} placement={'bottom'}>
        <Button
          className={'url-col-item'}
          size="small"
          icon={<LinkOutlined />}
          onClick={handleLinkPage}
          aria-label="Link Icon"
        />
      </Tooltip>
      <Tooltip title={'Copied'} trigger="focus">
        <Tooltip title={path} placement={'bottom'}>
          <Button
            className={'url-col-item'}
            size="small"
            icon={<CopyOutlined />}
            onClick={handleCopy}
            aria-label="Copy Icon"
          />
        </Tooltip>
      </Tooltip>
    </Container>
  );
};

export default URLColumn;
