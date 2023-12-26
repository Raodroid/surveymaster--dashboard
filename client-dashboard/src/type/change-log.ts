import { UserPayload } from '@/redux/user';
import { IProject } from '@/type/project';
import { IAction } from '@/interfaces';

export type ChangeLog = {
  id: string;
  deletedAt?: string;
  displayId: string;
  type: 'Survey' | 'Question';
  createdAt: string;
  event: string;
  actionBy: UserPayload;
  project: Partial<IProject>;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  actions: IAction[];
  survey?: {
    name: string;
    id: string;
  };
};
