import React, { FC, useCallback, useMemo } from 'react';
import { RoundedSelect } from '@/customize-components';
import { SelectProps } from 'antd/lib/select';
import { useNavigate } from 'react-router';
import qs from 'qs';
import { useParseQueryString } from '@/hooks';
import {
  ActionThreeDropDownType,
  IGetParams,
  IMenuItem,
  IProject,
  ISurveyVersion,
  QsParams,
  SurveyVersionStatus,
} from '@/type';
import { useCheckSurveyFormMode } from '@pages/Survey';
import { useFormikContext } from 'formik';
import { Modal } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { useCheckScopeEntityDefault } from '@/modules/common';
import { EntityEnum } from '@/enums';
import { PenFilled, Refresh, TrashOutlined } from '@/icons';
import ThreeDotsDropdown from '../../../../../../customize-components/ThreeDotsDropdown';

const { confirm } = Modal;

const SurveyVersionSelect: FC<{
  versions?: ISurveyVersion[];
  value: SelectProps['value'];
}> = props => {
  const { versions = [], value } = props;
  const qsParams = useParseQueryString<IGetParams & { version?: string }>();
  const navigate = useNavigate();
  const { isEditMode } = useCheckSurveyFormMode();
  const { dirty } = useFormikContext(); //only use the component inside formik component

  const handleDirect = useCallback(
    options => {
      const newQes = qs.stringify({
        ...qsParams,
        version: options.label,
      });
      navigate(`${window.location.pathname}?${newQes}`);
    },
    [navigate, qsParams],
  );

  const changeVersion = useCallback(
    (version, options) => {
      if (isEditMode && dirty) {
        confirm({
          icon: null,
          content: (
            <Trans
              i18nKey="direction.warningLostData" // optional -> fallbacks to defaults if not provided
            />
          ),
          onOk() {
            handleDirect(options);
          },
        });
        return;
      }
      handleDirect(options);
    },
    [dirty, handleDirect, isEditMode],
  );
  const options: SelectProps['options'] = (versions || [])?.map(ver => {
    const color =
      ver.status === SurveyVersionStatus.COMPLETED ? '#00AB00' : '#007AE7';
    return {
      label: (
        <div className={'flex gap-3 it items-center'}>
          <span
            className={'w-[8px] h-[8px] rounded-full'}
            style={{ background: color }}
          />
          {ver.displayId}
        </div>
      ),
      value: ver?.id || '',
    };
  });

  return (
    <RoundedSelect
      value={value}
      options={options}
      className={'w-[200px]'}
      onChange={changeVersion}
    />
  );
};

export default SurveyVersionSelect;
//
// const ACTION = {
//   MARK_AS_COMPLETE: 'MARK_AS_COMPLETE',
//   EDIT_VERSION: 'EDIT_VERSION',
//   DUPLICATE: 'DUPLICATE',
//   DELETE: 'DELETE',
//   EXPORT: 'EXPORT',
// } as const;
//
// const ActionThreeDropDown: FC<ActionThreeDropDownType<IProject>> = props => {
//   const { record, handleSelect } = props;
//   const { t } = useTranslation();
//   const qsParams = useParseQueryString<QsParams>();
//
//   const { canDelete, canRestore, canUpdate } = useCheckScopeEntityDefault(
//     EntityEnum.PROJECT,
//   );
//
//   const items = useMemo<IMenuItem[]>(() => {
//     const baseMenu: IMenuItem[] = [];
//
//     if (qsParams.isDeleted) return baseMenu;
//
//     if (canUpdate) {
//       baseMenu.push({
//         key: ACTION.EDIT,
//         icon: <PenFilled className={'text-primary'} />,
//         label: <label className={''}> {t('common.editProject')}</label>,
//       });
//     }
//     if (canDelete && !record?.deletedAt) {
//       baseMenu.push({
//         key: ACTION.DELETE,
//         icon: <TrashOutlined className={'text-primary'} />,
//         label: <label className={''}> {t('common.deleteProject')}</label>,
//       });
//     }
//     if (canRestore && record?.deletedAt) {
//       baseMenu.push({
//         key: ACTION.RESTORE,
//         icon: <Refresh />,
//         label: <label className={''}> {t('common.restoreProject')}</label>,
//       });
//     }
//
//     return baseMenu;
//   }, [
//     canDelete,
//     canRestore,
//     canUpdate,
//     qsParams.isDeleted,
//     record?.deletedAt,
//     t,
//   ]);
//
//   return (
//     <ThreeDotsDropdown
//       onChooseItem={key => handleSelect({ key, record })}
//       items={items}
//     />
//   );
// };
