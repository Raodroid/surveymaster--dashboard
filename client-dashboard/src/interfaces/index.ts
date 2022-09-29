export interface Test {
  a: string;
}

export interface UserUpdatedDto {
  // roles: number[]; Don't allow user update their role by this api
  id?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  phonePrefix?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  displayName?: string; // new field
}

export interface GetTeamMembers {
  page: number;
  take: number;
  roles: number[];
  isDeleted: boolean;
  q?: string;
}

export interface InviteMember {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  description?: string;
  roles?: number[];
}

export interface UpdateMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  description?: string;
  roles?: number[];
}
