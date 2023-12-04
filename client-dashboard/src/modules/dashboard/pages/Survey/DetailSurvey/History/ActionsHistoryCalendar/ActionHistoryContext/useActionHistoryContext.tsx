import { useContext } from 'react';
import { ActionHistortContext } from './ActionHistoryContext';

export const useActionHistoryContext = () => {
  return useContext(ActionHistortContext);
};
