import { IAction } from '@/interfaces';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { genHandleActionType } from '@pages/Survey';
import { Avatar, Divider } from 'antd';
import React from 'react';

function Action(props: { action?: IAction; today?: boolean }) {
  const { action, today = false } = props;
  const { t } = useTranslation();

  if (!action)
    return (
      <div className={'font-semibold'}>{t('actionType.noActionsYet')}</div>
    );

  return (
    <div className="w-full overflow-hidden flex gap-4 text-textColor">
      <Avatar src={action.owner.avatar} />

      <div className={''}>
        <div className="flex items-center h-[32px]">
          <span className="font-[500]">
            {action.owner.firstName + ' ' + action.owner.lastName}
          </span>

          <Divider type="vertical" className={'h-[8px] mx-[16px] my-0'} />

          <span className="opacity-40">
            {today || !action?.createdAt
              ? t('common.today')
              : moment(action.createdAt).fromNow()}
          </span>
        </div>
        <div className={`font-[500]`}>{genHandleActionType(action, t)}</div>
      </div>
    </div>
  );
}

export default Action;
