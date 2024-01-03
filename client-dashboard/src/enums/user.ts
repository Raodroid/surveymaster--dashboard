export enum EntityEnum {
  USER = 'user',
  SURVEY = 'survey',
  PROJECT = 'project',
  CATEGORY = 'category',
  QUESTION = 'question',
}

export const SCOPE_CONFIG = {
  ACTION: {
    READ: 'READ',
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    RESTORE: 'RESTORE',
  },
  ENTITY: {
    USER: EntityEnum.USER,
    SURVEY: EntityEnum.SURVEY,
    PROJECT: EntityEnum.PROJECT,
    CATEGORY: EntityEnum.CATEGORY,
    QUESTION: EntityEnum.QUESTION,
  },
};
