import React, { FC } from 'react';
import { Avatar, Divider, List } from 'antd';
import moment from 'moment';
import { IQuestionRemark } from '@/type';

const DisplayRemarkItem: FC<{ record: IQuestionRemark }> = props => {
  const { record } = props;

  return (
    <List.Item>
      <div className="w-full overflow-hidden flex gap-4 text-textColor">
        <Avatar src={record.owner?.avatar} />

        <div className={'flex-1'}>
          <div className="flex items-center h-[32px]">
            <span className="font-[500]">
              {`${record.owner?.firstName || ''} ${
                record.owner?.lastName || ''
              }`}
            </span>

            <Divider type="vertical" style={{ margin: '0 16px', height: 8 }} />

            <span className="opacity-40">
              {moment(record.createdAt).fromNow()}
            </span>
          </div>
          <div className={`font-[500]`}>{record.remark}</div>
        </div>
      </div>
    </List.Item>
  );
};

export default DisplayRemarkItem;
