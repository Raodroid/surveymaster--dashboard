import { PostPutMember } from 'interfaces';
import * as Yup from 'yup';
import { INVALID_FIELDS } from './../../../common/validate/validate';

export const inviteMemberSchema = Yup.object({
  firstName: Yup.string().required(INVALID_FIELDS.REQUIRED).trim(),
  lastName: Yup.string().required(INVALID_FIELDS.REQUIRED).trim(),
  email: Yup.string()
    .required(INVALID_FIELDS.REQUIRED)
    .email(INVALID_FIELDS.EMAIL_INVALID)
    .trim(),
  departmentName: Yup.string().required(INVALID_FIELDS.REQUIRED).trim(),
  roles: Yup.array().min(1, INVALID_FIELDS.REQUIRED),
});

export const postPutInitialValues: PostPutMember = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  displayName: '',
  roles: [],
  departmentName: '',
};