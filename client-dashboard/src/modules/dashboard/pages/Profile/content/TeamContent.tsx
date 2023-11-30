import {
  EyeOutlined,
  SettingOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Divider, Form, Input, InputRef, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { STAFF_ADMIN_DASHBOARD_ROLE_LIMIT } from 'enums';
import { SCOPE_CONFIG } from 'enums/user';
import { useParseQueryString } from 'hooks/useParseQueryString';
import { SearchIcon } from 'icons/SearchIcon';
import _get from 'lodash/get';
import qs from 'qs';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { AuthSelectors } from 'redux/auth';
import { UserPayload } from 'redux/user';
import { AdminService } from 'services';
import { ActionThreeDropDownType, IGetParams, IMenuItem, QsParams } from 'type';

import { CustomFallbackStyled, TeamContentStyled } from '../styles';
import {
  ConfirmDeactivateUserModal,
  ConfirmRestoreUserModal,
  ResetUserPasswordModal,
  UpdateMemberModal,
} from './modals';
import SimpleBar from 'simplebar-react';
import { HannahCustomSpin, StyledPagination } from 'modules/dashboard';
import { useCheckScopeEntityDefault } from 'modules/common';
import { keysAction, useSelectTableRecord } from 'hooks';
import { ThreeDotsDropdown } from 'customize-components';

interface TeamMember extends UserPayload {
  key: string;
  name: string;
  deletedAt: Date;
}

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: TeamMember[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
  },
  getCheckboxProps: (record: TeamMember) => ({
    disabled: record.name === 'Disabled User',
    name: record.name,
  }),
};

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

function TeamContent() {
  const { t } = useTranslation();
  const profile = useSelector(AuthSelectors.getProfile);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [userId, setUserId] = useState<string>('');
  const allRoles = useSelector(AuthSelectors.getAllRoles);

  const [search, setSearch] = useState('');
  const searchRef = useRef<InputRef>(null);
  const qsParams = useParseQueryString<QsParams>();

  const [showConfirmDeactivateModal, setShowConfirmDeactivateModal] =
    useState<boolean>(false);
  const [showConfirmRestoreModal, setShowConfirmRestoreModal] =
    useState<boolean>(false);
  const [showResetPasswordModal, setShowResetPasswordModal] =
    useState<boolean>(false);
  const [showEditPreferencesModal, setShowEditPreferencesModal] =
    useState<boolean>(false);

  const { canRead } = useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.USER);

  const baseParams = useMemo<IGetParams>(() => {
    if (qsParams.q) setSearch(qsParams.q);

    return {
      q: qsParams.q || initParams.q,
      page: Number(qsParams.page) || initParams.page,
      take: Number(qsParams.take) || initParams.take,
      isDeleted: qsParams.isDeleted === 'true',
      roles: Object.values(allRoles).map(elm => elm.id),
    };
  }, [allRoles, qsParams]);

  const { data: teamMembers, isLoading } = useQuery(
    ['getTeamMembers', baseParams, canRead],
    () => AdminService.getTeamMembers(baseParams),
    {
      refetchOnWindowFocus: false,
      enabled: canRead,
    },
  );

  const total: number = _get(teamMembers, 'data.itemCount', 0);

  const handleNavigate = useCallback(
    (props: IGetParams) => {
      const {
        q = qsParams.q || initParams.q,
        page = qsParams.page || initParams.page,
        take = qsParams.take || initParams.take,
        isDeleted = qsParams.isDeleted === 'true',
      } = props;
      const newParams = {
        ...qsParams,
        q,
        page,
        take,
        isDeleted,
      };
      navigate(pathname + '?' + qs.stringify(newParams), { replace: true });
    },
    [navigate, pathname, qsParams],
  );

  const handleSearch = useCallback(() => {
    handleNavigate({ q: searchRef.current?.input?.value, page: 1 });
  }, [handleNavigate, searchRef]);

  const handleSubmitBtn = useCallback(() => {
    if (!searchRef.current?.input?.value && !qsParams.q) {
      searchRef.current?.focus();
      return;
    }
    handleSearch();
  }, [searchRef, handleSearch, qsParams]);

  const handleEditPreferences = useCallback((record: TeamMember) => {
    setUserId(record?.key);
    setShowEditPreferencesModal(true);
  }, []);

  const handleResetPassword = useCallback((record: TeamMember) => {
    setUserId(record?.key);
    setShowResetPasswordModal(true);
  }, []);

  const handleRemoveFromTeam = useCallback(
    () => setShowConfirmDeactivateModal(true),
    [],
  );

  const handleRestore = useCallback(() => setShowConfirmRestoreModal(true), []);

  const tableActions = useMemo<keysAction<TeamMember>>(
    () => [
      {
        key: ACTION.RESET_PASSWORD,
        action: handleResetPassword,
      },
      {
        key: ACTION.EDIT_PREFERENCE,
        action: handleEditPreferences,
      },
      {
        key: ACTION.DELETE,
        action: handleRemoveFromTeam,
      },
      {
        key: ACTION.RESTORE,
        action: handleRestore,
      },
    ],
    [
      handleEditPreferences,
      handleRemoveFromTeam,
      handleResetPassword,
      handleRestore,
    ],
  );

  const { handleSelect, selectedRecord } =
    useSelectTableRecord<TeamMember>(tableActions);

  const columns: ColumnsType<TeamMember> = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'avatar',
        render: (src: string, record: TeamMember) =>
          src ? (
            <img
              src={src}
              width={40}
              height={40}
              style={{ borderRadius: 12 }}
              alt=""
            />
          ) : (
            <CustomFallbackStyled className="flex-center">
              {record.firstName.slice(0, 1).toUpperCase()}
              {record.lastName.slice(0, 1).toUpperCase()}
            </CustomFallbackStyled>
          ),
        className: 'avatar-cell',
        width: 68,
      },
      {
        title: 'Name',
        dataIndex: 'name',
      },

      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Authentication',
        dataIndex: 'authentication',
        render: (_, record: TeamMember) => {
          const list = Object.values(allRoles).filter(elm =>
            record.userRoles?.some(el => el.roleId === elm.id),
          );

          return (
            <div>
              {list.map((elm: TeamMember, index: number) => (
                <span style={{ fontSize: 12 }} key={elm.id}>
                  {elm.name} {index !== list.length - 1 && '| '}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        title: '',
        width: 50,
        dataIndex: 'threeDots',
        render: (_, record: TeamMember) => (
          <ActionThreeDropDown
            record={record}
            handleSelect={handleSelect}
            profile={profile}
          />
        ),
      },
    ],
    [allRoles, handleSelect, profile],
  );

  const data: TeamMember[] = useMemo(
    () =>
      teamMembers
        ? teamMembers?.data.data.map((user: TeamMember) => {
            return {
              key: user.id,
              avatar: user.avatar || '',
              firstName: user.firstName,
              lastName: user.lastName,
              name: user.firstName + ' ' + user.lastName,
              email: user.email,
              userRoles: user.userRoles,
              deletedAt: user.deletedAt,
            };
          })
        : [],
    [teamMembers],
  );
  const wrapperRef = useRef<any>(null);
  return (
    <TeamContentStyled>
      <div className="cell padding-24 name title flex-a-center">AMiLi</div>

      <div className="cell flex flex-col" style={{ overflow: 'hidden' }}>
        {canRead && (
          <>
            <div className="search padding-24 flex-center">
              <Form onFinish={handleSearch} className="search-form flex-center">
                <Button className="search-btn" onClick={handleSubmitBtn}>
                  <SearchIcon />
                </Button>
                <Input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  allowClear
                  placeholder="Search Team Member..."
                />
              </Form>
              <Checkbox
                className="show-inactivate-users-checkbox"
                checked={qsParams.isDeleted === 'true'}
                onChange={() => {
                  handleNavigate({
                    isDeleted: qsParams.isDeleted !== 'true',
                  });
                }}
              >
                {t('common.showInactivateUsers')}
              </Checkbox>
            </div>

            <Divider />

            <div className="table-wrapper" ref={wrapperRef}>
              <HannahCustomSpin parentRef={wrapperRef} spinning={isLoading} />
              <SimpleBar>
                <Table
                  style={{ padding: '0 10px' }}
                  rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                  }}
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </SimpleBar>
            </div>
            <StyledPagination
              onChange={(page, pageSize) =>
                handleNavigate({ page: page, take: pageSize })
              }
              showSizeChanger
              pageSize={baseParams.take}
              total={total}
              current={baseParams.page}
            />
          </>
        )}
      </div>

      <UpdateMemberModal
        userData={
          teamMembers
            ? teamMembers?.data.data.find(user => user.id === userId)
            : {}
        }
        showModal={showEditPreferencesModal}
        setShowModal={setShowEditPreferencesModal}
      />
      <ResetUserPasswordModal
        userId={userId}
        showModal={showResetPasswordModal}
        setShowModal={setShowResetPasswordModal}
      />
      <ConfirmDeactivateUserModal
        userId={userId}
        showModal={showConfirmDeactivateModal}
        setShowModal={setShowConfirmDeactivateModal}
      />
      <ConfirmRestoreUserModal
        userId={userId}
        showModal={showConfirmRestoreModal}
        setShowModal={setShowConfirmRestoreModal}
      />
    </TeamContentStyled>
  );
}

export default TeamContent;

const ACTION = {
  EDIT_PREFERENCE: 'EDIT_PREFERENCE',
  DELETE: 'DELETE',
  RESTORE: 'RESTORE',
  RESET_PASSWORD: 'RESET_PASSWORD',
} as const;

const ActionThreeDropDown: FC<
  ActionThreeDropDownType<TeamMember> & { profile }
> = props => {
  const { record, handleSelect, profile } = props;
  const { t } = useTranslation();
  const currentRoles = useSelector(AuthSelectors.getCurrentRoleIds);

  const { canDelete, canRestore, canUpdate } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.USER,
  );
  const isAdminRole = useMemo(() => {
    return STAFF_ADMIN_DASHBOARD_ROLE_LIMIT.includes(currentRoles);
  }, [currentRoles]);

  const items = useMemo<IMenuItem[]>(() => {
    const baseMenu: IMenuItem[] = [];

    if (record.deletedAt && canRestore) {
      baseMenu.push({
        key: ACTION.RESTORE,
        icon: <UserDeleteOutlined className="text-primary" />,
        label: <label className={''}> {t('common.restore')}</label>,
      });
      return baseMenu;
    }

    if (canUpdate) {
      baseMenu.push({
        disabled: !isAdminRole,
        key: ACTION.EDIT_PREFERENCE,
        icon: <SettingOutlined className="text-primary" />,
        label: <label className={''}> {t('common.editPreferences')}</label>,
      });
    }
    if (profile && record.key !== profile.id) {
      if (canUpdate) {
        baseMenu.push({
          key: ACTION.RESET_PASSWORD,
          icon: <EyeOutlined className="text-primary" />,
          label: <label className={''}> {t('common.resetPassword')}</label>,
        });
      }
      if (canDelete) {
        baseMenu.push({
          key: ACTION.DELETE,
          icon: <UserDeleteOutlined className="text-primary" />,
          label: <label className={''}> {t('common.removeFromTeam')}</label>,
        });
      }
    }
    return baseMenu;
  }, [
    canDelete,
    canRestore,
    canUpdate,
    isAdminRole,
    profile,
    record.deletedAt,
    record.key,
    t,
  ]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
    />
  );
};
