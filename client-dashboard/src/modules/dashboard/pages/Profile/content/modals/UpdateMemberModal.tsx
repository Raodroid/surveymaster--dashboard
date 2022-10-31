import { Button, Form, notification } from 'antd';
import { MODAL_WIDTH } from 'enums';
import { Formik } from 'formik';
import { CloseIcon } from 'icons';
import { InviteMember, UpdateMember } from 'interfaces';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { AdminService } from 'services';
import * as Yup from 'yup';
import { ProfileModal } from '.';
import { onError } from '../../../../../../utils/funcs';
import InviteMemberInputs, {
  useInviteMemberSchema,
} from '../forms/InviteMember';
import { UpdateMemberModalStyled } from './styles';
import SimpleBar from 'simplebar-react';

const initialValues = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  displayName: '',
  userRoles: [],
  departmentName: '',
};

interface InviteModal extends Omit<ProfileModal, 'userId'> {
  userData?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    departmentName: string;
    userRoles: number[];
  };
}

function UpdateMemberModal(props: InviteModal) {
  const { showModal, setShowModal, userData } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { inviteMemberSchema } = useInviteMemberSchema();

  const userInit = useMemo(() => {
    return userData
      ? {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          displayName: userData.displayName,
          departmentName: userData.departmentName,
          userRoles: userData.userRoles,
        }
      : initialValues;
  }, [userData]);

  // const InviteMemberSchema = Yup.object({
  //   firstName: Yup.string().required(t('validation.messages.required')).trim(),
  //   lastName: Yup.string().required(t('validation.messages.required')).trim(),
  //   email: Yup.string()
  //     .required(t('validation.messages.required'))
  //     .email(t('validation.messages.emailInvalid'))
  //     .trim(),
  //   departmentName: Yup.string()
  //     .required(t('validation.messages.required'))
  //     .trim(),
  //   roles: Yup.array().min(1, t('validation.messages.required')),
  // });

  const createHandleStatus = useCallback(
    (successMessage: string) => {
      return {
        onSuccess: () => {
          setShowModal(false);
          notification.success({ message: t(`common.${successMessage}`) });
          queryClient.invalidateQueries('getTeamMembers');
        },
        onError,
      };
    },
    [setShowModal, t, queryClient],
  );

  const mutationUpdateMember = useMutation(
    (payload: UpdateMember) => AdminService.updateMember(payload),
    createHandleStatus('updateSuccess'),
  );

  const handleFinish = (payload: UpdateMember) => {
    mutationUpdateMember.mutateAsync(payload);
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
