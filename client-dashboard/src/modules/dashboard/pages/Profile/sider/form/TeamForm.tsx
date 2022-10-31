import { Button, Divider, Form, notification } from 'antd';
import { STAFF_ADMIN_DASHBOARD_ROLE_LIMIT } from 'enums';
import { SCOPE_CONFIG } from 'enums/user';
import { Formik } from 'formik';
import { InviteMember } from 'interfaces';
import useCheckScopeEntity, {
  ScopeActionArray,
} from 'modules/common/hoc/useCheckScopeEntity';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { AdminService } from 'services';
import { onError } from '../../../../../../utils/funcs';
import InviteMemberInputs, {
  useInviteMemberSchema,
} from '../../content/forms/InviteMember';
import SimpleBar from 'simplebar-react';
import { InviteMemberFormWrapper } from '../../styles';

const initialValues = {
  id: '',
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
  const { inviteMemberSchema } = useInviteMemberSchema();

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

  const createHandleStatus = useCallback(
    (successMessage: string) => {
      return {
        onSuccess: () => {
          notification.success({ message: t(`common.${successMessage}`) });
          queryClient.invalidateQueries('getTeamMembers');
        },
        onError,
      };
    },
    [t, queryClient],
  );

  const mutationInviteMember = useMutation(
    (payload: InviteMember) => AdminService.inviteMember(payload),
    createHandleStatus('inviteSuccess'),
  );

  const handleFinish = (payload: InviteMember) => {
    console.log(canCreate, isAdminRole);
    if (!canCreate || !isAdminRole) return;
    return mutationInviteMember.mutateAsync(payload);
  };

  return (
    <InviteMemberFormWrapper>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={handleFinish}
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
                  {t('common.saveEdits')}
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
