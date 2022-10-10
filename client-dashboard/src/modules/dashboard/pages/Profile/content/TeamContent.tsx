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
  Pagination,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { STAFF_ADMIN_DASHBOARD_ROLE_LIMIT } from 'enums';
import { SCOPE_CONFIG } from 'enums/user';
import { CloseIcon } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import useCheckScopeEntity, {
  ScopeActionArray,
} from 'modules/common/hoc/useCheckScopeEntity';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';
import { AdminService } from 'services';
import { useDebounce } from 'utils';
import {
  CustomFallbackStyled,
  DropDownMenuStyled,
  TableWrapperStyled,
  TeamContentStyled,
} from '../styles';
import {
  ConfirmDeactivateUserModal,
  ConfirmRestoreUserModal,
  InviteMemberModal,
  ResetUserPasswordModal,
} from './modals';

interface DataType {
  key: React.Key;
  avatar?: string;
  name: string;
  email: string;
  authentication: string;
}

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === 'Disabled User',
    name: record.name,
  }),
};

function TeamContent() {
  const { t } = useTranslation();
  const profile = useSelector(AuthSelectors.getProfile);

  const searchRef = useRef<InputRef>(null);
  const [userId, setUserId] = useState('');
  const allRoles = useSelector(AuthSelectors.getAllRoles);
  const currentRoles = useSelector(AuthSelectors.getCurrentRoleIds);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const searchDebounce = useDebounce(search);
  const [page, setPage] = useState(1);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [showConfirmDeactivateModal, setShowConfirmDeactivateModal] =
    useState(false);
  const [showConfirmRestoreModal, setShowConfirmRestoreModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showEditPreferencesModal, setShowEditPreferencesModal] =
    useState(false);

  const isAdminRole = useMemo(() => {
    return STAFF_ADMIN_DASHBOARD_ROLE_LIMIT.includes(currentRoles);
  }, [currentRoles]);

  const productActionNeedToCheckedPermission: ScopeActionArray[] = [
    { action: SCOPE_CONFIG.ACTION.CREATE },
    { action: SCOPE_CONFIG.ACTION.UPDATE },
    { action: SCOPE_CONFIG.ACTION.DELETE },
    { action: SCOPE_CONFIG.ACTION.RESTORE },
  ];
  const [canCreate, canEdit, canDelete, canRestore] = useCheckScopeEntity(
    SCOPE_CONFIG.ENTITY.USERS,
    productActionNeedToCheckedPermission,
  );

  useEffect(() => {
    if (!searchDebounce) setFilter('');
  }, [searchDebounce]);

  const baseParams = useMemo(
    () => ({
      page: page,
      take: 10,
      roles: Object.values(allRoles).map(elm => elm.id),
      isDeleted: isDeleted,
      q: filter,
    }),
    [filter, page, isDeleted, allRoles],
  );

  const { data: teamMembers, isLoading } = useQuery(
    ['getTeamMembers', filter, isDeleted, page],
    () => AdminService.getTeamMembers(baseParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleEditPreferences = (id: string) => {
    setUserId(id);
    setShowEditPreferencesModal(true);
  };

  const handleResetPassword = (id: string) => {
    setUserId(id);
    setShowResetPasswordModal(true);
  };

  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'avatar',
        render: (src: string, record: any) =>
          src ? (
            <img
              src={src}
              width={40}
              height={40}
              style={{ borderRadius: 12 }}
              alt=""
            />
          ) : (
            <CustomFallbackStyled className="flex-j-center">
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
        render: (_, record: any) => {
          const list = Object.values(allRoles).filter(elm =>
            record.authentication.some(el => el.roleId === elm.id),
          );

          return (
            <div>
              {list.map((elm: any, index: number) => (
                <span style={{ fontSize: 12 }}>
                  {elm.name} {index !== list.length - 1 && '| '}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        title: '',
        dataIndex: 'threeDots',
        render: (_, record: any) => (
          <ThreeDotsDropdown
            overlay={
              <DropDownMenuStyled>
                {canEdit && (
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
                )}
                {profile && record.key !== profile.id && canEdit && (
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
                )}
                {!record.deletedAt &&
                  profile &&
                  profile.id !== record.key &&
                  canDelete && (
                    <Menu.Item
                      key="deactivateUser"
                      disabled={!isAdminRole}
                      onClick={() => setShowConfirmDeactivateModal(true)}
                    >
                      <UserDeleteOutlined className="dropdown-icon" />{' '}
                      {t('common.deactivateUser')}
                    </Menu.Item>
                  )}
                {record.deletedAt && canRestore && (
                  <Menu.Item
                    key="restore"
                    disabled={!isAdminRole}
                    onClick={() => setShowConfirmRestoreModal(true)}
                  >
                    <DeleteOutlined className="dropdown-icon" />{' '}
                    {t('common.restore')}
                  </Menu.Item>
                )}
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
    [profile, t, isAdminRole, canEdit, canRestore, canDelete, allRoles],
  );

  const data: DataType[] = teamMembers
    ? teamMembers.data.data.map(user => {
        return {
          key: user.id,
          avatar: user.avatar || '',
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          authentication: user.userRoles,
          deletedAt: user.deletedAt,
        };
      })
    : [];

  return (
    <TeamContentStyled className="flex">
      <div className="cell padding-24 name title">AMiLi</div>

      <div className="cell flex-column table-wrapper">
        <div className="search padding-24 flex-center">
          <Button
            className="search-btn"
            onClick={() => {
              if (search.trim()) {
                setFilter(search);
              } else {
                searchRef.current?.focus();
              }
            }}
          >
            <SearchIcon />
          </Button>
          <Form
            onFinish={() => setFilter(search)}
            className="search-form flex-center"
          >
            <Input
              value={search}
              ref={searchRef}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Team Member..."
            />
            {search && (
              <Button
                className="clear-btn"
                onClick={() => {
                  setSearch('');
                }}
              >
                <CloseIcon />
              </Button>
            )}
          </Form>
          <Checkbox
            className="show-inactivate-users-checkbox"
            checked={isDeleted}
            onChange={() => setIsDeleted(isDeleted)}
          >
            {t('common.showInactivateUsers')}
          </Checkbox>
          {canCreate && (
            <Button
              type="primary"
              disabled={!isAdminRole}
              onClick={() => setShowInviteModal(true)}
            >
              {t('common.inviteMember')}
            </Button>
          )}
        </div>

        <Divider />

        <TableWrapperStyled>
          <CustomSpinSuspense spinning={isLoading}>
            <Table
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              scroll={{ y: 'calc(100vh - 420px)' }}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
            <Pagination
              className="flex-end pagination"
              showSizeChanger={false}
              defaultCurrent={page}
              current={page}
              total={teamMembers?.data?.pageCount * 10}
              onChange={e => setPage(e)}
            />
          </CustomSpinSuspense>
        </TableWrapperStyled>
      </div>

      <InviteMemberModal
        showModal={showInviteModal}
        setShowModal={setShowInviteModal}
      />
      <InviteMemberModal
        userData={
          teamMembers
            ? teamMembers.data.data.find(user => user.id === userId)
            : {}
        }
        showModal={showEditPreferencesModal}
        setShowModal={setShowEditPreferencesModal}
        edit
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
