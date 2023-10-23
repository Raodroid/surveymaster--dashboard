import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { SCOPE_CONFIG } from 'enums';

export interface ScopeActionArray {
  action: string;
  metadata?: (value) => boolean;
}

export const useCheckScopeEntity = (
  entity: string,
  actions: ScopeActionArray[],
): boolean[] => {
  const allScopesValues = useSelector(AuthSelectors.getCurrentScopes);

  return useMemo<boolean[]>(() => {
    return actions.map(action => {
      return allScopesValues.some(scope => {
        let checkPermission =
          scope?.action === action.action && scope?.entity === entity;
        if (action.metadata) {
          return (
            checkPermission &&
            scope?.metadata &&
            action.metadata(scope.metadata)
          );
        }
        return checkPermission;
      });
    });
  }, [actions, entity, allScopesValues]);
};

const permissions: ScopeActionArray[] = [
  { action: SCOPE_CONFIG.ACTION.DELETE },
  { action: SCOPE_CONFIG.ACTION.UPDATE },
  { action: SCOPE_CONFIG.ACTION.CREATE },
  { action: SCOPE_CONFIG.ACTION.READ },
  { action: SCOPE_CONFIG.ACTION.RESTORE },
];

export const useCheckScopeEntityDefault = (
  entity: string,
): {
  canDelete: boolean;
  canUpdate: boolean;
  canCreate: boolean;
  canRead: boolean;
  canRestore: boolean;
} => {
  const [canDelete, canUpdate, canCreate, canRead, canRestore] =
    useCheckScopeEntity(entity, permissions);

  return useMemo(
    () => ({
      canRead,
      canCreate,
      canUpdate,
      canDelete,
      canRestore,
    }),
    [canCreate, canDelete, canRead, canRestore, canUpdate],
  );
};
