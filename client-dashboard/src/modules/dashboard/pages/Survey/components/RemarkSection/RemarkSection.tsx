import React, { FC, useState } from 'react';
import { IQuestionRemark } from '@/type';
import { Avatar, Button, Empty, List } from 'antd';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '@/redux/auth';
import { INPUT_TYPES } from '@input/type';
import { UncontrolledInput } from '@/modules/common';
import { useCheckSurveyFormMode } from '@pages/Survey';
import { useTranslation } from 'react-i18next';
import DisplayRemarkItem from './DisplayRemarkItem';
import { useField } from 'formik';

interface IRemarkSection {
  remarks: IQuestionRemark[];
  fieldName: string;
}

const RemarkSection: FC<IRemarkSection> = props => {
  const { remarks, fieldName } = props;
  const profile = useSelector(AuthSelectors.getProfile);
  const { isEditMode } = useCheckSurveyFormMode();
  const { t } = useTranslation();
  const [newRemark, setNewRemark] = useState('');
  const [{ value }, , { setValue }] = useField<IQuestionRemark[]>(
    `${fieldName}.remarks`,
  );

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
                <UncontrolledInput
                  inputType={INPUT_TYPES.INPUT}
                  type={'text'}
                  className={'w-full'}
                  value={newRemark}
                  onChange={e => {
                    setNewRemark(e);
                  }}
                />
                <Button
                  className={'info-btn'}
                  onClick={() => {
                    const newItem: IQuestionRemark = {
                      remark: newRemark,
                      owner: {
                        avatar: profile?.avatar,
                        firstName: profile?.firstName || '',
                        lastName: profile?.lastName || '',
                      },
                      createdAt: Date().toString(),
                    };
                    setValue([newItem, ...(value || [])]);
                    setNewRemark('');
                  }}
                >
                  {t('common.add')}
                </Button>
              </div>
            </div>
          </div>
        </List.Item>
      )}
      {remarks.length === 0 ? (
        <Empty />
      ) : (
        remarks.map(item => (
          <DisplayRemarkItem key={item.createdAt} record={item} />
        ))
      )}
    </List>
  );
};

export default RemarkSection;
