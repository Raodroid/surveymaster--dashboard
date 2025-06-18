import {FC, useCallback} from 'react';
import {Button, Tooltip} from 'antd';
import {CopyOutlinedIcon} from 'icons';

const CopyButton: FC<{ content: string | undefined | number }> = props => {
  const { content } = props;
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content as string);
  }, [content]);
  return (
    <Tooltip title={'Copied'} trigger="focus">
      <Tooltip title={content} placement={'bottom'}>
        <Button
          className={'url-col-item text-textColor'}
          size="small"
          type={'text'}
          icon={<CopyOutlinedIcon />}
          onClick={handleCopy}
          aria-label="Copy Icon"
        />
      </Tooltip>
    </Tooltip>
  );
};

export default CopyButton;
