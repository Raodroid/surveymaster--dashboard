import { useContext } from 'react';
import { ActionHistoryContext } from './ActionHistoryContext';

export const useActionHistoryContext = () => {
  return useContext(ActionHistoryContext);
};
