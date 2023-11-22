import React, { FC } from 'react';
import { IQuestionRemark } from '@/type';
import { Avatar, Button, Divider, List } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '@/redux/auth';
import { INPUT_TYPES } from '@input/type';
import { ControlledInput } from '@/modules/common';
import { useCheckSurveyFormMode } from '@pages/Survey';
import { useTranslation } from 'react-i18next';

interface IRemarkSection {
  remarks: IQuestionRemark[];
}

const RemarkSection: FC<IRemarkSection> = props => {
  const { remarks } = props;
  const profile = useSelector(AuthSelectors.getProfile);
  const { isEditMode } = useCheckSurveyFormMode();
  const { t } = useTranslation();
  return (
    <List itemLayout="horizontal">
      {isEditMode && (
        <List.Item>
          <div className="w-full overflow-hidden flex gap-4 text-textColor">
            <Avatar src={profile?.avatar} />

            <div className={'flex-1'}>
              <div className="flex items-center h-[32px]">
                <span className="font-[500]">
                  {profile?.firstName + ' ' + profile?.lastName}
                </span>
              </div>
              <div className={`font-[500] flex justify-start gap-3`}>
                <ControlledInput
                  inputType={INPUT_TYPES.INPUT}
                  type={'text'}
                  name="remark"
                  disabled
                  className={'w-full'}
                />
                <Button className={'info-btn'}>{t('common.add')}</Button>
              </div>
            </div>
          </div>
        </List.Item>
      )}
      {remarks.map(item => (
        <List.Item key={item.id}>
          <div className="w-full overflow-hidden flex gap-4 text-textColor">
            <Avatar src={item.owner.avatar} />

            <div className={'flex-1'}>
              <div className="flex items-center h-[32px]">
                <span className="font-[500]">
                  {item.owner.firstName + ' ' + item.owner.lastName}
                </span>

                <Divider
                  type="vertical"
                  style={{ margin: '0 16px', height: 8 }}
                />

                <span className="opacity-40">
                  {moment(item.createdAt).fromNow()}
                </span>
              </div>
              <div className={`font-[500]`}>{item.remark}</div>
            </div>
          </div>
        </List.Item>
      ))}
    </List>
  );
};

export default RemarkSection;
