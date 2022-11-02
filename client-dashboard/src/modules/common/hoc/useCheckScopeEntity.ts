import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AuthSelectors } from '../../../redux/auth';
import { SCOPE_CONFIG } from '../../../enums/user';

export interface ScopeActionArray {
  action: string;
  metadata?: (value) => boolean;
}

const permissions: ScopeActionArray[] = [
  { action: SCOPE_CONFIG.ACTION.DELETE },
  { action: SCOPE_CONFIG.ACTION.UPDATE },
  { action: SCOPE_CONFIG.ACTION.CREATE },
  { action: SCOPE_CONFIG.ACTION.READ },
];

export const useCheckScopeEntity = (
  entity: string,
): {
  canDelete: boolean;
  canUpdate: boolean;
  canCreate: boolean;
  canRead: boolean;
  canRestore: boolean;
} => {
  const allScopesValues = useSelector(AuthSelectors.getCurrentScopes);

  return useMemo(() => {
    const result = {
      canRead: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
      canRestore: false,
    };
    permissions.forEach(permission => {
      if (
        allScopesValues.some(
          scope =>
            scope.action === permission.action && scope.entity === entity,
        )
      ) {
        switch (permission.action) {
          case SCOPE_CONFIG.ACTION.DELETE: {
            result.canDelete = true;
            break;
          }
          case SCOPE_CONFIG.ACTION.UPDATE: {
            result.canUpdate = true;
            break;
          }
          case SCOPE_CONFIG.ACTION.CREATE: {
            result.canCreate = true;
            break;
          }
          case SCOPE_CONFIG.ACTION.READ: {
            result.canRead = true;
            break;
          }
          case SCOPE_CONFIG.ACTION.RESTORE: {
            result.canRestore = true;
            break;
          }
          default: {
          }
        }
      }
    });
    return result;
  }, [allScopesValues, entity]);
};
