import { Button, Form, notification } from 'antd';
import { SCOPE_CONFIG } from 'enums';
import { Formik } from 'formik';
import { PostPutMember } from 'interfaces';
import { useCheckScopeEntityDefault } from 'modules/common/hoc';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { AdminService } from 'services';
import SimpleBar from 'simplebar-react';
import { onError } from '@/utils';
import InviteMemberInputs from '../../content/inputs/InviteMemberInputs';
import { InviteMemberFormWrapper } from '../../styles';
import { postPutInitialValues } from '../../utils';
import { INVITE_MEMBER_SCHEMA } from '@/modules/common';

function TeamForm() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { canCreate } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.USER);

  const mutationInviteMember = useMutation(
    (payload: PostPutMember) => AdminService.inviteMember(payload),
    {
      onSuccess: () => {
        notification.success({ message: t('common.inviteSuccess') });
        queryClient.invalidateQueries('getTeamMembers');
      },
      onError,
    },
  );

  const handleFinish = (payload: PostPutMember, actions) => {
    const { id, ...rest } = payload;
    return mutationInviteMember.mutateAsync(rest, {
      onSuccess: () => {
        actions.resetForm();
      },
    });
  };

  return (
    <InviteMemberFormWrapper>
      {canCreate ? (
        <Formik
          onSubmit={handleFinish}
          enableReinitialize={true}
          initialValues={postPutInitialValues}
          validationSchema={INVITE_MEMBER_SCHEMA}
        >
          {({ handleSubmit: handleFinish }) => (
            <Form
              layout="vertical"
              onFinish={handleFinish}
              className="flex flex-col"
            >
              <div className="title">{t('common.inviteNewMember')}</div>
              <div className="input-wrapper">
                <SimpleBar style={{ maxHeight: '100%' }}>
                  <InviteMemberInputs edit={false} />
                </SimpleBar>
              </div>
              <div className="flex-center footer flex flex-col">
                <div className="flex">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-btn secondary-btn sent-invitation"
                    loading={mutationInviteMember.isLoading}
                  >
                    {t('common.sendInvitation')}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      ) : null}
    </InviteMemberFormWrapper>
  );
}

export default TeamForm;
