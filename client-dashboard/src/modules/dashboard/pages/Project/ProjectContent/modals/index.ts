export { default as DeleteProjectModal } from './DeleteProject';
export { default as RestoreProjectModal } from './RestoreProject';

export interface IProjectModal {
  showModal: boolean;
  setShowModal: (payload: any) => void;
}
