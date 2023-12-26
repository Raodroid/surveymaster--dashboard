import React, { FC, useCallback, useMemo, useState } from 'react';
import { Button, Divider, Form, Modal, notification, Spin } from 'antd';
import { Formik } from 'formik';
import { ControlledInput, INVALID_FIELDS } from '@/modules/common';
import { INPUT_TYPES } from '@input/type';
import {
  IGetParams,
  IModal,
  IOptionItem,
  IUpdateSurveyVersionStatusDto,
  SurveyVersionStatus,
} from '@/type';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import { AdminService, SurveyService } from '@/services';
import { onError, useDebounce } from '@/utils';
import { RoleEnum } from '@/enums';
import _get from 'lodash/get';

const initValue: { userId: string } = {
  userId: '',
};

const baseParams: IGetParams = {
  // q: searchDebounce,
  selectAll: true,
  isDeleted: false,
  roleIds: [RoleEnum.STAFF_SUPER_ADMIN],
};

const RequestApproveCompleteSurveyModal: FC<
  IModal & { surveyId?: string; versionId?: string }
> = props => {
  const { toggleOpen, open, versionId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>('');

  const handleTyping = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const searchDebounce = useDebounce(search);

  const changeSurveyVersionStatusMutation = useMutation(
    (data: IUpdateSurveyVersionStatusDto) => {
      return SurveyService.updateStatusSurveyVersion({
        ...data,
        surveyVersionId: versionId as string,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getSurveyById');
        notification.success({ message: t('common.updateSuccess') });
        toggleOpen();
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
      changeSurveyVersionStatusMutation.mutateAsync({
        status: SurveyVersionStatus.AWAIT_APPROVAL,
        approvalUserId: values.userId,
      });
    },
    [changeSurveyVersionStatusMutation],
  );

  return (
    <>
      <Modal
        centered
        title={t('common.requestApproveCompleteSurvey')}
        onCancel={toggleOpen}
        open={open}
        footer={false}
      >
        <Spin
          spinning={isLoading || changeSurveyVersionStatusMutation.isLoading}
        >
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

export default RequestApproveCompleteSurveyModal;
