import { FC, memo, useState, useCallback } from 'react';
import {
  QuestionBranchIcon,
  SurveyDataTreeNode,
  useCheckSurveyFormMode,
  useSurveyBlockAction,
} from '@pages/Survey';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { SubSurveyFlowElement } from '@/type';
import { ControlledInput } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { useMutation, useQueryClient } from 'react-query';
import { SurveyService } from '@/services';
import { Button, Divider, Modal, Tooltip, notification, Form } from 'antd';
import { DuplicateIcon, TrashOutlined, PlusOutLinedIcon } from '@/icons';
import { onError } from '@/utils';
import { CREATE_MESSAGE_FIELDS } from 'modules/common/validate/validate';

const Header: FC<{ focusBlock: SurveyDataTreeNode }> = props => {
  const { t } = useTranslation();
  const { focusBlock } = props;
  const fieldName = focusBlock.fieldName;
  const queryClient = useQueryClient();
  const [isShowModal, setIsShowModal] = useState(false);
  const { isViewMode } = useCheckSurveyFormMode();
  const { handleDuplicateBlock, handleRemoveBlock } =
    useSurveyBlockAction(focusBlock);

  const { mutateAsync: createEndMessageMutate, isLoading } = useMutation(
    (data: { name: string, content: string }) => SurveyService.createEndMessage(data),
    {
      onSuccess: () => {
        setIsShowModal(false);
        queryClient.invalidateQueries('getEndMessages');
        notification.success({ message: t('common.createSuccess') });
      },
      onError,
    },
  );

  const onFinish = useCallback((values) => {
    createEndMessageMutate(values);
  }, [createEndMessageMutate]);

  return (
    <div className={'p-6 flex items-center gap-1'}>
      <>
        <QuestionBranchIcon type={focusBlock?.type} />
        {focusBlock?.type === SubSurveyFlowElement.BLOCK ? (
          <ControlledInput
            className={`w-[200px] hide-helper-text ${
              isViewMode ? 'view-mode' : ''
            }`}
            inputType={INPUT_TYPES.INPUT}
            name={`${fieldName}.blockDescription`}
          />
        ) : (
          <span className={'font-semibold'}>
            {t(`common.${focusBlock?.type}`)}
          </span>
        )}
        {focusBlock?.type === SubSurveyFlowElement.END_SURVEY && (
          <>
          <Button className='ml-2' type={'default'} icon={<PlusOutLinedIcon />} onClick={() => setIsShowModal(true)}/>
          {isShowModal && <Modal
            title="Create Message"
            open={isShowModal}
            onCancel={() => setIsShowModal(false)}
            width={600}
            footer={null}
          >
            <Formik
              onSubmit={onFinish}
              initialValues={{ name: '', content: ''}}
              validationSchema={Yup.object().shape(CREATE_MESSAGE_FIELDS)}
            >
              {({ handleSubmit }) => (
                <div className={'w-full'}>
                  <Form
                    layout={'vertical'}
                    onFinish={handleSubmit}
                  >
                    <ControlledInput
                      inputType={INPUT_TYPES.INPUT}
                      name="name"
                      label="Name"
                      customFormProps={{ required: true }}
                    />
                    <ControlledInput
                      inputType={INPUT_TYPES.TEXTAREA}
                      name="content"
                      label="Content"
                      customFormProps={{ required: true }}
                      rows={5}
                    />
                    <Button
                      className="secondary-btn w-full"
                      htmlType="submit"
                      type='primary'
                      size='large'
                      loading={isLoading}
                    >
                      {t('common.submit')}
                    </Button>
                  </Form>
                </div>
              )}
            </Formik>
          </Modal>
          }
        </>
        )}
        {!isViewMode && (
          <>
            <Divider type="vertical" className={'h-[8px] mx-[16px] my-0'} />
            <Tooltip title={t('common.duplicateBlock')}>
              <Button
                type={'text'}
                icon={<DuplicateIcon />}
                onClick={handleDuplicateBlock}
              />
            </Tooltip>
            <Divider type="vertical" className={'h-[8px] mx-[16px] my-0'} />
            <Tooltip title={t('common.deleteBlock')}>
              <Button
                type={'text'}
                icon={<TrashOutlined />}
                onClick={handleRemoveBlock}
              />
            </Tooltip>
          </>
        )}
      </>
    </div>
  );
};

export default memo(Header);
