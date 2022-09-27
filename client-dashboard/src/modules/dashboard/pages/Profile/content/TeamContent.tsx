import {
  DeleteFilled,
  EyeOutlined,
  SettingFilled,
  UserDeleteOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  InputRef,
  Menu,
  notification,
  Pagination,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { CloseIcon } from 'icons';
import { SearchIcon } from 'icons/SearchIcon';
import { GetTeamMembers } from 'interfaces';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AuthSelectors } from 'redux/auth';
import { AdminService } from 'services';
import APIService from 'services/survey-master-service/base.service';
import { onError, useDebounce } from 'utils';
import {
  DropDownMenuStyled,
  TableWrapperStyled,
  TeamContentStyled,
} from '../styles';
import { InviteMemberModal, ResetUserPasswordModal } from './modals';
import ConfirmDeactivateUserModal from './modals/ConfirmDeactivateUser';

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
  const navigate = useNavigate();
  const profile = useSelector(AuthSelectors.getProfile);

  const searchRef = useRef<InputRef>(null);
  const [userId, setUserId] = useState('');
  const allRoles = useSelector(AuthSelectors.getAllRoles);
  const queryRoles = useMemo(() => {
    return allRoles ? Object.values(allRoles).map(el => el.id) : [];
  }, [allRoles]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const searchDebounce = useDebounce(search);
  const [page, setPage] = useState(1);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showEditPreferencesModal, setShowEditPreferencesModal] =
    useState(false);

  useEffect(() => {
    if (!searchDebounce) setFilter('');
  }, [searchDebounce]);

  const baseParams = useMemo(
    () => ({
      page: page,
      take: 10,
      roles: queryRoles,
      isDeleted: isDeleted,
      isActivated: true,
      q: filter,
    }),
    [filter, page, isDeleted, queryRoles],
  );

  function getTeamMembers(params: GetTeamMembers): Promise<any> {
    return AdminService.getTeamMembers(params);
  }

  const { data: teamMembers, isLoading } = useQuery(
    ['getTeamMembers', filter, isDeleted, page],
    () => getTeamMembers(baseParams),
    {
      refetchOnWindowFocus: false,
    },
  );

  const mutationRestoreUser = useMutation(
    () => {
      return AdminService.restoreUser({
        userId,
      });
    },
    {
      onSuccess: () => notification.success(t('common.updateSuccess')),
      onError,
    },
  );

  const handleRestoreUser = useCallback(() => {
    mutationRestoreUser.mutateAsync();
  }, [mutationRestoreUser]);

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
        render: (src: string) => (
          <Image
            src={src}
            width={40}
            height={40}
            style={{ borderRadius: 12 }}
          />
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
      },
      {
        title: '',
        dataIndex: 'threeDots',
        render: (_, record: any) => (
          <ThreeDotsDropdown
            overlay={
              <DropDownMenuStyled>
                <Menu.Item
                  key="editPreferences"
                  onClick={() => {
                    handleEditPreferences(record.key);
                  }}
                >
                  <SettingFilled className="dropdown-icon" />{' '}
                  {t('common.editPreferences')}
                </Menu.Item>
                {profile && record.key !== profile.id && (
                  <Menu.Item
                    key="resetUserPassword"
                    onClick={() => {
                      handleResetPassword(record.key);
                    }}
                  >
                    <EyeOutlined className="dropdown-icon" />{' '}
                    {t('common.resetPassword')}
                  </Menu.Item>
                )}
                {(isDeleted || !record.deleteAt) &&
                  profile &&
                  profile.id !== record.key && (
                    <Menu.Item
                      key="deactivateUser"
                      onClick={() => setShowConfirmModal(true)}
                    >
                      <UserDeleteOutlined className="dropdown-icon" />{' '}
                      {t('common.deactivateUser')}
                    </Menu.Item>
                  )}
                {record.deleteAt && (
                  <Menu.Item key="restore" onClick={handleRestoreUser}>
                    <DeleteFilled className="dropdown-icon" />{' '}
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
    [profile, handleRestoreUser, t, isDeleted],
  );

  const data: DataType[] = teamMembers
    ? teamMembers.data.data.map(user => {
        return {
          key: user.id,
          avatar: '',
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          authentication: 'auth',
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
            onChange={() => setIsDeleted(!isDeleted)}
          >
            {t('common.showInactivateUsers')}
          </Checkbox>
          <Button type="primary" onClick={() => setShowInviteModal(true)}>
            {t('common.inviteMember')}
          </Button>
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
        showModal={showConfirmModal}
        setShowModal={setShowConfirmModal}
      />
    </TeamContentStyled>
  );
}

export default TeamContent;
