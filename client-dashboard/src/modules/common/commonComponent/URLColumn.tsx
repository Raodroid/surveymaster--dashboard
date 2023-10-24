import styled from 'styled-components';
import React, { useCallback } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import CopyButton from '@/modules/common/commonComponent/CopyButton/CopyButton';

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
      <CopyButton content={path} />
    </Container>
  );
};

export default URLColumn;
