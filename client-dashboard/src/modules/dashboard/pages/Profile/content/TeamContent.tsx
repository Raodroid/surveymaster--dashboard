import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputRef,
  Menu,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { STAFF_ADMIN_DASHBOARD_ROLE_LIMIT } from 'enums';
import { SCOPE_CONFIG } from 'enums/user';
import { useParseQueryString } from 'hooks/useParseQueryString';
import { SearchIcon } from 'icons/SearchIcon';
import _get from 'lodash/get';
import { useCheckScopeEntityDefault } from 'modules/common/hoc/useCheckScopeEntityDefault';
import qs from 'qs';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { AuthSelectors } from 'redux/auth';
import { UserPayload } from 'redux/user';
import { AdminService } from 'services';
import { IGetParams } from 'type';
import { QsParams } from '../../Project/ProjectContent/components/project-filter/ProjectFilter';
import {
  CustomFallbackStyled,
  DropDownMenuStyled,
  TeamContentStyled,
} from '../styles';
import {
  ConfirmDeactivateUserModal,
  ConfirmRestoreUserModal,
  ResetUserPasswordModal,
  UpdateMemberModal,
} from './modals';
import SimpleBar from 'simplebar-react';
import HannahCustomSpin from '@components/HannahCustomSpin';
import { StyledPagination } from '@/modules/dashboard';
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
  const currentRoles = useSelector(AuthSelectors.getCurrentRoleIds);

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

  const isAdminRole = useMemo(() => {
    return STAFF_ADMIN_DASHBOARD_ROLE_LIMIT.includes(currentRoles);
  }, [currentRoles]);

  const { canUpdate, canDelete, canRestore, canRead } =
    useCheckScopeEntityDefault(SCOPE_CONFIG.ENTITY.USER);

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
    () => (canRead ? AdminService.getTeamMembers(baseParams) : () => {}),
    {
      refetchOnWindowFocus: false,
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

  const handleEditPreferences = (id: string) => {
    setUserId(id);
    setShowEditPreferencesModal(true);
  };

  const handleResetPassword = (id: string) => {
    setUserId(id);
    setShowResetPasswordModal(true);
  };

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
          <ThreeDotsDropdown
            overlay={
              <DropDownMenuStyled>
                {!record.deletedAt && canUpdate ? (
                  <Menu.Item
                    key="editPreferences"
                    disabled={!isAdminRole}
                    onClick={() => {
                      handleEditPreferences(record.key);
                    }}
                  >
                    <SettingOutlined className="dropdown-icon" />{' '}
                    {t('common.editPreferences')}
                  </Menu.Item>
                ) : null}
                {profile &&
                canUpdate &&
                !record.deletedAt &&
                record.key !== profile.id ? (
                  <Menu.Item
                    key="resetUserPassword"
                    disabled={!isAdminRole}
                    onClick={() => {
                      handleResetPassword(record.key);
                    }}
                  >
                    <EyeOutlined className="dropdown-icon" />{' '}
                    {t('common.resetPassword')}
                  </Menu.Item>
                ) : null}
                {profile &&
                canDelete &&
                !record.deletedAt &&
                profile.id !== record.key ? (
                  <Menu.Item
                    key="deactivateUser"
                    disabled={!isAdminRole}
                    onClick={() => setShowConfirmDeactivateModal(true)}
                  >
                    <UserDeleteOutlined className="dropdown-icon" />{' '}
                    {t('common.removeFromTeam')}
                  </Menu.Item>
                ) : null}
                {record.deletedAt && canRestore ? (
                  <Menu.Item
                    key="restore"
                    disabled={!isAdminRole}
                    onClick={() => setShowConfirmRestoreModal(true)}
                  >
                    <DeleteOutlined className="dropdown-icon" />{' '}
                    {t('common.restore')}
                  </Menu.Item>
                ) : null}
              </DropDownMenuStyled>
            }
            trigger={['click']}
            onOpenChange={() => {
              setUserId(record.key);
            }}
          />
        ),
      },
    ],
    [profile, t, isAdminRole, canUpdate, canRestore, canDelete, allRoles],
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

      <div className="cell flex-column" style={{ overflow: 'hidden' }}>
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
