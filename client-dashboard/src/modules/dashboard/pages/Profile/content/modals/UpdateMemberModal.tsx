import { Button, Form, notification } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { PostPutMember } from 'interfaces';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { UserPayload } from 'redux/user';
import { AdminService } from 'services';
import SimpleBar from 'simplebar-react';
import { ProfileModal } from '.';
import { onError } from 'utils';
import { postPutInitialValues } from '../../utils';
import InviteMemberInputs from '../inputs/InviteMemberInputs';
import { UpdateMemberModalStyled } from './styles';
import { INVITE_MEMBER_SCHEMA } from '../../../../../common/validate/validate';

interface UpdateModal extends Omit<ProfileModal, 'userId'> {
  userData?: UserPayload;
}

function UpdateMemberModal(props: UpdateModal) {
  const { showModal, setShowModal, userData } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const userInit = useMemo<PostPutMember>(() => {
    return userData
      ? {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          departmentName: userData.departmentName,
          roles: userData.userRoles?.map(elm => elm.roleId),
        }
      : postPutInitialValues;
  }, [userData]);

  const mutationUpdateMember = useMutation(
    (payload: PostPutMember) => AdminService.updateMember(payload),
    {
      onSuccess: () => {
        setShowModal(false);
        notification.success({ message: t('common.updateSuccess') });
        queryClient.invalidateQueries('getTeamMembers');
      },
      onError,
    },
  );

  const handleFinish = (payload: PostPutMember) => {
    mutationUpdateMember.mutateAsync(payload);
  };

  return (
    <UpdateMemberModalStyled
      centered
      destroyOnClose
      footer={false}
      open={showModal}
      closeIcon={<CloseIcon />}
      width={MODAL_WIDTH.SMALL}
      title={t('common.editPreferences')}
      onCancel={() => setShowModal(false)}
    >
      <>
        <Formik
          enableReinitialize={true}
          initialValues={userInit}
          onSubmit={handleFinish}
          validationSchema={INVITE_MEMBER_SCHEMA}
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
