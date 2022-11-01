import templateVariable from '../app/template-variables.module.scss';

export const DEFAULT_THEME_COLOR = {
  PRIMARY: 'rgb(201 67 151)',
  SECONDARY: '#25216a',
  ERROR: templateVariable.danger_color,
  SUCCESS: templateVariable.success_color,
  WARNING: templateVariable.warning_color,
};
