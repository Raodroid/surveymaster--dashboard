export interface CreateProject {
  name?: string;
  id?: string;
  description?: string;
  personInCharge?: string;
}

export interface UpdateProject {
  name?: string;
  id?: string;
  description?: string;
  personInCharge?: string;
}

export interface ISurveyQuestion {
  questionVersionId: string;
  remark: string;
  sort: number;
}
export interface UpdateSurvey {
  id: string;
  name: string;
  remark: string;
  questions: ISurveyQuestion[];
  projectId: string;
}
