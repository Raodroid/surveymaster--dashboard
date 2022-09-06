import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../../../redux/auth';

export interface ScopeActionArray {
  action: string;
  metadata?: (value) => boolean;
}
function useCheckScopeEntity(entity: string, actions: ScopeActionArray[]) {
  const allScopesValues = useSelector(AuthSelectors.getCurrentScopes);
  return useMemo<boolean[]>(() => {
    return actions.map(action => {
      return allScopesValues.some(scope => {
        let checkPermission =
          scope.action === action.action && scope.entity === entity;
        if (action.metadata) {
          return (
            checkPermission && scope.metadata && action.metadata(scope.metadata)
          );
        }
        return checkPermission;
      });
    });
  }, [actions, entity, allScopesValues]);
}

export default useCheckScopeEntity;
