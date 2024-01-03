import { FC, useCallback, useMemo, useState } from 'react';
import { Button, Divider, Form, Modal, notification, Spin } from 'antd';
import { Formik } from 'formik';
import { ControlledInput, INVALID_FIELDS } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import { IGetParams, IModal, IOptionItem, QuestionVersionStatus } from '@/type';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { AdminService, QuestionBankService } from '@/services';
import { onError, useDebounce } from '@/utils';
import { RoleEnum, ROUTE_PATH } from '@/enums';
import _get from 'lodash/get';
import { useNavigate } from 'react-router-dom';

const initValue: { userId: string } = {
  userId: '',
};

const baseParams: IGetParams = {
  selectAll: true,
  isDeleted: false,
  roleIds: [RoleEnum.STAFF_SUPER_ADMIN],
};

const RequestApproveCompleteQuestionModal: FC<
  IModal & { versionId?: string }
> = props => {
  const { toggleOpen, open, versionId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');

  const handleTyping = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const searchDebounce = useDebounce(search);

  const updateQuestionVersionStatus = useMutation(
    (data: {
      status: QuestionVersionStatus;
      approvalUserId: string;
      id: string;
    }) => {
      return QuestionBankService.changeStatusQuestionVersion({
        ...data,
        // version: { status },
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        await queryClient.invalidateQueries('getQuestionQuery');
        notification.success({ message: t('common.updateSuccess') });
        navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT);
      },
      onError,
    },
  );

  const { data, isLoading } = useQuery(
    ['getAdmins', baseParams],
    () => AdminService.getTeamMembers(baseParams),
    {
      refetchOnWindowFocus: false,
      onError,
    },
  );

  const optionsList = useMemo<IOptionItem[]>(
    () =>
      _get(data, 'data.data', []).map(elm => {
        return {
          label: `${elm.firstName || ''} ${elm.lastName || ''}`,
          value: elm.id,
        };
      }),
    [data],
  );

  const options = useMemo<IOptionItem[]>(
    () =>
      optionsList.reduce((result: IOptionItem[], option) => {
        if ((option?.label as string).toLowerCase().includes(searchDebounce)) {
          return [...result, option];
        }
        return result;
      }, []),
    [optionsList, searchDebounce],
  );

  const onSubmit = useCallback(
    (values: typeof initValue) => {
      if (!versionId) return;
      updateQuestionVersionStatus.mutateAsync({
        status: QuestionVersionStatus.AWAIT_APPROVAL,
        approvalUserId: values.userId,
        id: versionId,
      });
    },
    [updateQuestionVersionStatus, versionId],
  );

  return (
    <>
      <Modal
        centered
        title={t('common.requestApproveCompleteQuestion')}
        onCancel={toggleOpen}
        open={open}
        footer={false}
      >
        <Spin spinning={isLoading || updateQuestionVersionStatus.isLoading}>
          <Formik
            enableReinitialize={true}
            onSubmit={onSubmit}
            initialValues={initValue}
            validationSchema={Yup.object().shape({
              userId: Yup.string().required(INVALID_FIELDS.REQUIRED),
            })}
          >
            {({ handleSubmit }) => (
              <>
                <Form
                  layout={'vertical'}
                  onFinish={handleSubmit}
                  className={'flex flex-col h-full'}
                  id={'rename-form'}
                >
                  <ControlledInput
                    showSearch
                    inputType={INPUT_TYPES.SELECT}
                    name="userId"
                    label={t('common.approvalPerson')}
                    options={options}
                    onSearch={handleTyping}
                  />
                  <Divider />
                  <Button
                    type={'primary'}
                    htmlType={'submit'}
                    size={'large'}
                    className="secondary-btn w-full"
                    form={'rename-form'}
                  >
                    {t('common.submit')}
                  </Button>
                </Form>
              </>
            )}
          </Formik>
        </Spin>
      </Modal>
    </>
  );
};

export default RequestApproveCompleteQuestionModal;
