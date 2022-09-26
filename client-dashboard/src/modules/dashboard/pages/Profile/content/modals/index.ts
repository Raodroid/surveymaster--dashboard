import { Dispatch, SetStateAction } from 'react';
export { default as ChangePasswordModal } from './ChangePasswordModal';
export { default as InviteMemberModal } from './InviteMemberModal';
export { default as ResetUserPasswordModal } from './ResetUserPassword';
export { default as SetUpPreferencesModal } from './SetUpPreferencesModal';
export interface ProfileModal {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}
