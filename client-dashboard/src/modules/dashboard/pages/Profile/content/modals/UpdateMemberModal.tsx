import { Button, Form, notification } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { UpdateMember } from 'interfaces';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { AdminService } from 'services';
import SimpleBar from 'simplebar-react';
import { ProfileModal } from '.';
import { onError } from '../../../../../../utils/funcs';
import { useInviteMemberSchema } from '../../utils';
import InviteMemberInputs from '../inputs/InviteMember';
import { UpdateMemberModalStyled } from './styles';

const initialValues = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  displayName: '',
  roles: [],
  userRoles: [],
  departmentName: '',
};

interface UpdateModal extends Omit<ProfileModal, 'userId'> {
  userData?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    departmentName: string;
    userRoles: Record<string, any>;
  };
}

function UpdateMemberModal(props: UpdateModal) {
  const { showModal, setShowModal, userData } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { inviteMemberSchema } = useInviteMemberSchema();
  const allRoles = useSelector(AuthSelectors.getAllRoles);

  const userInit = useMemo(() => {
    return userData
      ? {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          displayName: userData.displayName,
          departmentName: userData.departmentName,
          roles: userData.userRoles?.map(elm => elm.roleId),
          userRoles: userData.userRoles?.map(elm => {
            const roles = Object.values(allRoles);
            const index = roles.findIndex(el => el.id === elm.roleId);
            return {
              ...elm,
              key: elm.roleId,
              id: elm.roleId,
              name: roles[index].name,
            };
          }),
        }
      : initialValues;
  }, [userData, allRoles]);

  const mutationUpdateMember = useMutation(
    (payload: UpdateMember) => AdminService.updateMember(payload),
    {
      onSuccess: () => {
        setShowModal(false);
        notification.success({ message: t('common.updateSuccess') });
        queryClient.invalidateQueries('getTeamMembers');
      },
      onError,
    },
  );

  const handleFinish = (payload: UpdateMember) => {
    let newPayload = { ...payload };
    if (payload.userRoles !== userInit.userRoles) {
      newPayload = { ...payload, roles: payload.userRoles };
    }
    delete newPayload.userRoles;
    mutationUpdateMember.mutateAsync(newPayload);
  };

  return (
    <UpdateMemberModalStyled
      open={showModal}
      destroyOnClose
      footer={false}
      onCancel={() => setShowModal(false)}
      width={MODAL_WIDTH.SMALL}
      centered
      title={t('common.editPreferences')}
      closeIcon={<CloseIcon />}
    >
      <>
        <Formik
          enableReinitialize={true}
          initialValues={userInit}
          onSubmit={handleFinish}
          validationSchema={inviteMemberSchema}
        >
          {({ handleSubmit }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <div className="input-wrapper">
                <SimpleBar style={{ maxHeight: 'calc(90vh - 364px)' }}>
                  <InviteMemberInputs edit={true} />
                </SimpleBar>
              </div>
              <div className="flex-center footer">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-btn secondary-btn"
                  loading={mutationUpdateMember.isLoading}
                >
                  {t('common.saveEdits')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </>
    </UpdateMemberModalStyled>
  );
}

export default UpdateMemberModal;
