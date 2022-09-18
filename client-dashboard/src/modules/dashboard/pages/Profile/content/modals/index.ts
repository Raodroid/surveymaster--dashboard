import { Dispatch } from 'react';
import { SetStateAction } from 'react';

export interface ProfileModal {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}
