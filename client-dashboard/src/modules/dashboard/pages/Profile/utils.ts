import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export const useInviteMemberSchema = () => {
  const { t } = useTranslation();
  const inviteMemberSchema = Yup.object({
    firstName: Yup.string().required(t('validation.messages.required')).trim(),
    lastName: Yup.string().required(t('validation.messages.required')).trim(),
    email: Yup.string()
      .required(t('validation.messages.required'))
      .email(t('validation.messages.emailInvalid'))
      .trim(),
    departmentName: Yup.string()
      .required(t('validation.messages.required'))
      .trim(),
    userRoles: Yup.array().min(1, t('validation.messages.required')),
  });
  return { inviteMemberSchema };
};
