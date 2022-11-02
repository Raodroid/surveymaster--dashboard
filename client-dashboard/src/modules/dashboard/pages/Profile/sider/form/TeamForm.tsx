import { Button, Divider, Form, notification } from 'antd';
import { STAFF_ADMIN_DASHBOARD_ROLE_LIMIT } from 'enums';
import { SCOPE_CONFIG } from 'enums/user';
import { Formik } from 'formik';
import { PostPutMember } from 'interfaces';
import useCheckScopeEntity, {
  ScopeActionArray,
} from 'modules/common/hoc/useCheckScopeEntity';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { AdminService } from 'services';
import SimpleBar from 'simplebar-react';
import { onError } from '../../../../../../utils/funcs';
import InviteMemberInputs from '../../content/inputs/InviteMemberInputs';
import { InviteMemberFormWrapper } from '../../styles';
import { inviteMemberSchema } from '../../utils';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  displayName: '',
  roles: [],
  departmentName: '',
};

function TeamForm() {
  const { t } = useTranslation();
  const currentRoles = useSelector(AuthSelectors.getCurrentRoleIds);
  const queryClient = useQueryClient();

  const productActionNeedToCheckedPermission: ScopeActionArray[] = [
    { action: SCOPE_CONFIG.ACTION.CREATE },
  ];
  const [canCreate] = useCheckScopeEntity(
    SCOPE_CONFIG.ENTITY.USERS,
    productActionNeedToCheckedPermission,
  );

  const isAdminRole = useMemo(() => {
    return STAFF_ADMIN_DASHBOARD_ROLE_LIMIT.includes(currentRoles);
  }, [currentRoles]);

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
    if (!canCreate || !isAdminRole) return;
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
        initialValues={initialValues}
        validationSchema={inviteMemberSchema}
      >
        {({ handleSubmit: handleFinish }) => (
          <Form
            layout="vertical"
            onFinish={handleFinish}
            className="flex-column"
          >
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
