import { Button, Divider, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { initImage } from '../form/UserForm';
import { TeamContentStyled, UserContentStyled } from '../styles';

interface DataType {
  key: React.Key;
  avatar?: string;
  name: string;
  email: string;
  authentication: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'avatar',
    render: (src: string) => (
      <img src={src} style={{ width: 40, height: 40, borderRadius: 12 }}></img>
    ),
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
];

const data: DataType[] = [
  {
    key: '1',
    avatar: initImage,
    name: 'John Brown',
    email: '@gmail.com',
    authentication: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    avatar: initImage,
    name: 'Jim Green',
    email: '@gmail.com',
    authentication: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    avatar: initImage,
    name: 'Joe Black',
    email: '@gmail.com',
    authentication: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    avatar: initImage,
    name: 'Disabled User',
    email: '@gmail.com',
    authentication: 'Sidney No. 1 Lake Park',
  },
];

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
  const dispatch = useDispatch();
  return (
    <TeamContentStyled className="flex">
      <div className="part padding-24 name title">AMiLi</div>

      <div className="part" style={{ flex: 1 }}>
        <div className="search padding-24">Search</div>
        <Divider />
        <div className="table">
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>

      <div className="part padding-24 flex-space-between">
        <div className="title">{t('common.deactivateTeam')}</div>
        <Button type="primary" className="btn">
          {t('common.deactivate')}
        </Button>
      </div>
    </TeamContentStyled>
  );
}

export default TeamContent;
