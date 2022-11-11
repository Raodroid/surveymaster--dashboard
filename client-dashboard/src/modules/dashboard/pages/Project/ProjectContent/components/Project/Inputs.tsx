import { Divider } from 'antd';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { AdminService } from 'services';
import { InputsWrapper } from './styles';
import { transformEnumToOption } from '../../../../../../../utils';
import { ProjectTypes } from '../../../../../../../type';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../../enums';

function Inputs() {
  const { t } = useTranslation();

  const allRoles = useSelector(AuthSelectors.getAllRoles);

  const editRouteMath = useMatch(
    ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.EDIT,
  );

  const isEditMode = !!editRouteMath;

  const baseParams = useMemo(
    () => ({
      roles: Object.values(allRoles).map(elm => elm.id),
      selectAll: true,
      isDeleted: false,
    }),
    [allRoles],
  );

  const { data: teamMembers } = useQuery(
    'getAllTeamMembers',
    () => AdminService.getTeamMembers(baseParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  const optionsList = useMemo(() => {
    if (teamMembers?.data?.data)
      return teamMembers.data.data.map(elm => {
        return { label: elm.firstName + ' ' + elm.lastName, value: elm.id };
      });
  }, [teamMembers]);

  return (
    <InputsWrapper>
      <div className="title mainInfo-title">{t('common.mainInformation')}:</div>
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        name="name"
        label={t('common.projectTitle')}
        className="projTitle"
      />
      <ControlledInput
        inputType={INPUT_TYPES.SELECT}
        name="type"
        label={t('common.projectType')}
        className="projType"
        disabled={isEditMode}
        options={transformEnumToOption(ProjectTypes, type =>
          t(`projectType.${type}`),
        )}
      />
      <ControlledInput
        inputType={INPUT_TYPES.TEXTAREA}
        name="description"
        label={t('common.projectDescription')}
        className="projDesc"
      />

      <Divider type="vertical" className="divider" />

      <div className="title projParams">{t('common.projectParameters')}:</div>
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        name="displayId"
        label="ID"
        className="projId"
        disabled
      />
      <ControlledInput
        inputType={INPUT_TYPES.SELECT}
        name="personInCharge"
        label={t('common.personInCharge')}
        className="personInCharge"
        options={optionsList}
        loading={!optionsList}
      />
    </InputsWrapper>
  );
}
export default Inputs;
