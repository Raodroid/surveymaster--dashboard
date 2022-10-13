import { Divider } from 'antd';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { AdminService } from 'services';
import { InputsWrapper } from './styles';

function Inputs() {
  const { t } = useTranslation();

  const allRoles = useSelector(AuthSelectors.getAllRoles);
  const [page, setPage] = useState(1);
  const [isDeleted, setIsDeleted] = useState(false);

  const baseParams = useMemo(
    () => ({
      page: page,
      take: 10,
      roles: Object.values(allRoles).map(elm => elm.id),
      isDeleted: isDeleted,
      q: '',
    }),
    [page, isDeleted, allRoles],
  );

  const { data: teamMembers } = useQuery(
    'teamMembers',
    () => AdminService.getTeamMembers(baseParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  const optionsList = useMemo(() => {
    if (teamMembers && teamMembers.data && teamMembers.data.data) {
      return teamMembers.data.data.map(elm => {
        return { label: elm.firstName + ' ' + elm.lastName, value: elm.id };
      });
    }
  }, [teamMembers]);

  return (
    <InputsWrapper>
      <div className="title mainInfo-title">{t('common.mainInformation')}:</div>
      <ControlledInput
        inputType={INPUT_TYPES.INPUT}
        name="name"
        label="Project Title"
        className="projTitle"
      />
      <ControlledInput
        inputType={INPUT_TYPES.TEXTAREA}
        name="description"
        label="Project Description"
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
      <CustomSpinSuspense spinning={!optionsList}>
        <ControlledInput
          inputType={INPUT_TYPES.SELECT}
          name="personInCharge"
          label="Person In Charge"
          className="personInCharge"
          options={optionsList}
        />
      </CustomSpinSuspense>
    </InputsWrapper>
  );
}
export default Inputs;
