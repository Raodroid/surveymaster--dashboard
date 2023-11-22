import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Empty, List, Modal } from 'antd';
import { IModal, IQuestionVersion } from '@/type';
import { SimpleBarCustom } from '@/customize-components';
import { RoundedTag } from '@components/index';
import moment from 'moment';
import { MOMENT_FORMAT } from '@/enums';
import { questionValueType } from '@pages/Survey';

interface IUpdateQuestionVersionModal extends IModal {
  questionVersion: questionValueType | null;
  handleSelectNewQuestionVersion: (questionVersionId: string) => void;
  currentVersionId?: string;
}

const UpdateQuestionVersionModal: FC<IUpdateQuestionVersionModal> = props => {
  const {
    open,
    questionVersion,
    toggleOpen,
    handleSelectNewQuestionVersion,
    currentVersionId,
  } = props;
  const { t } = useTranslation();
  const dataSource = (questionVersion?.versions || []).sort((a, b) =>
    moment(a?.createdAt).isAfter(b?.createdAt) ? -1 : 1,
  );

  return (
    <>
      <Modal
        open={open}
        title={t('common.questionChangeLog')}
        onCancel={toggleOpen}
        width={720}
        footer={false}
      >
        {!questionVersion ? (
          <Empty />
        ) : (
          <SimpleBarCustom>
            <List
              itemLayout="horizontal"
              dataSource={dataSource}
              renderItem={(item: IQuestionVersion, index) => (
                <List.Item
                  onClick={() => {
                    handleSelectNewQuestionVersion(item.id as string);
                    toggleOpen();
                  }}
                  className={
                    'cursor-pointer hover:[#8c8c8c29] flex items-center px-2'
                  }
                >
                  <div className={'flex-1'}>
                    <div className={'flex items-center gap-3'}>
                      <span
                        className={'w-[8px] h-[8px] rounded-full'}
                        style={{
                          background:
                            currentVersionId === item.id
                              ? '#000'
                              : index === 0
                              ? '#00AB00'
                              : '#FF634E',
                        }}
                      ></span>
                      <span className={'text-[12px] text-textColor'}>
                        {moment(item.createdAt).format(MOMENT_FORMAT.DOB)}
                      </span>
                    </div>

                    <div
                      className={'font-semibold mb-2 ml-[18px] text-textColor'}
                    >
                      {item.title}
                    </div>
                  </div>
                  <RoundedTag title={t(`questionType.${item.type}`)} />
                </List.Item>
              )}
            />
          </SimpleBarCustom>
        )}
      </Modal>
    </>
  );
};

export default UpdateQuestionVersionModal;
