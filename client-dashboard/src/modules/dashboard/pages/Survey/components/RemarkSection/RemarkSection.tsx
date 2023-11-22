import React, { FC } from 'react';
import { IQuestionRemark } from '@/type';
import { Avatar, Button, List } from 'antd';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '@/redux/auth';
import { INPUT_TYPES } from '@input/type';
import { ControlledInput } from '@/modules/common';
import { useCheckSurveyFormMode } from '@pages/Survey';
import { useTranslation } from 'react-i18next';
import DisplayRemarkItem from './DisplayRemarkItem';

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
        <DisplayRemarkItem key={item.id} record={item} />
      ))}
    </List>
  );
};

export default RemarkSection;
