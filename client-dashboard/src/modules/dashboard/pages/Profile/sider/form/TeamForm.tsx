import { Button, Divider, Form, notification } from 'antd';
import { Formik } from 'formik';
import { PostPutMember } from 'interfaces';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { AdminService } from 'services';
import SimpleBar from 'simplebar-react';
import { onError } from '../../../../../../utils/funcs';
import InviteMemberInputs from '../../content/inputs/InviteMemberInputs';
import { InviteMemberFormWrapper } from '../../styles';
import { inviteMemberSchema, postPutInitialValues } from '../../utils';

function TeamForm() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // const currentRoles = useSelector(AuthSelectors.getCurrentRoleIds);
  // const isAdminRole = useMemo(() => {
  //   return STAFF_ADMIN_DASHBOARD_ROLE_LIMIT.includes(currentRoles);
  // }, [currentRoles]);

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
    return mutationInviteMember.mutateAsync(payload, {
      onSuccess: () => {
        actions.resetForm();
      },
    });
  };

  return (
    <InviteMemberFormWrapper>
      <Formik
        onSubmit={handleFinish}
        enableReinitialize={true}
        initialValues={postPutInitialValues}
        validationSchema={inviteMemberSchema}
      >
        {({ handleSubmit: handleFinish }) => (
          <Form
            layout="vertical"
            onFinish={handleFinish}
            className="flex-column"
          >
            <div className="title">{t('common.inviteNewMember')}</div>
            <div className="input-wrapper">
              <SimpleBar style={{ maxHeight: '100%' }}>
                <InviteMemberInputs edit={false} />
              </SimpleBar>
            </div>
            <div className="flex-center footer flex-column">
              <div className="flex">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-btn secondary-btn"
                  loading={mutationInviteMember.isLoading}
                >
                  {t('common.sendInvitation')}
                </Button>
              </div>

              <Divider />

              <div className="flex">
                <Button
                  type="primary"
                  className="invitation-link info-btn"
                  // loading={mutationInviteMember.isLoading}
                >
                  {t('common.copyInvitationLink')}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </InviteMemberFormWrapper>
  );
}

export default TeamForm;
