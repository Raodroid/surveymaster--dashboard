import { Button, Menu, PaginationProps, Table } from 'antd';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { PenFilled } from 'icons';
import _get from 'lodash/get';
import { CustomSpinSuspense } from 'modules/common/styles';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import ProjectService from 'services/survey-master-service/project.service';
import { GetListQuestionDto, IGetParams, IProject } from 'type';
import useParseQueryString from '../../../../../../hooks/useParseQueryString';
import { onError, useDebounce } from '../../../../../../utils';
import HannahCustomSpin from '../../../../components/HannahCustomSpin';
import StyledPagination from '../../../../components/StyledPagination';
import { ProjectTableWrapper } from '../style';

const initParams: IGetParams = {
  q: '',
  page: 1,
  take: 10,
  isDeleted: false,
};

const getProjects = (params: GetListQuestionDto) => {
  const newParams: GetListQuestionDto = {
    ...params,
  };
  for (const key in newParams) {
    if (!newParams[key] && typeof newParams[key] !== 'boolean') {
      delete newParams[key];
    }
  }
  return ProjectService.getProjects(newParams);
};

function ProjectTable(props: { filterValue?: string }) {
  const wrapperRef = useRef<any>();
  const [searchTxt, setSearchTxt] = useState<string>('');
  const queryString = useParseQueryString<GetListQuestionDto>();
  const navigate = useNavigate();
  const routePath = ROUTE_PATH.DASHBOARD_PATHS.PROJECT;

  const [params, setParams] = useState<GetListQuestionDto>(initParams);

  const debounceSearchText = useDebounce(searchTxt);

  const getProjectListQuery = useQuery(
    ['getProjects', params, debounceSearchText],
    () => {
      return getProjects({
        ...params,
        q: debounceSearchText,
      });
    },
    {
      onError,
    },
  );

  const total: number = _get(getProjectListQuery.data, 'data.itemCount', 0);

  const projects = useMemo<IProject[]>(
    () => _get(getProjectListQuery.data, 'data.data'),
    [getProjectListQuery.data],
  );

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = useCallback(
    (current, pageSize) => {
      setParams(s => ({ ...s, take: pageSize }));
    },
    [],
  );

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'project',
        key: 'project',
        render: (_, record: any) => <div>{record?.id}</div>,
      },
      {
        title: 'Project Title',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: any) => (
          <Link
            to={
              routePath.SURVEY.replace(':id', record?.id) +
              `?projectName=${record.name}`
            }
          >
            {text}
          </Link>
        ),
      },
      {
        title: 'N of Surveys',
        dataIndex: 'numberOfSurveys',
        key: 'numberOfSurveys',
        render: (text: any) => <div>{text}</div>,
      },
      {
        title: 'Person In Charge',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (_, record: any) => (
          <div>
            {record?.personResponsible?.firstName}{' '}
            {record?.personResponsible?.lastName}
          </div>
        ),
      },
      {
        title: 'Date of Creation',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: any) => {
          const str = text.toString();
          return <div>{str.slice(0, 10)}</div>;
        },
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record: any) => (
          <div className="flex-center actions">
            <Button
              onClick={() =>
                navigate(
                  routePath.PROJECT.EDIT.replace(':id', record.id) +
                    `?projectName=${record.name}`,
                )
              }
            >
              <PenFilled />
            </Button>
            <ThreeDotsDropdown overlay={<Menu />} trigger={['click']} />
          </div>
        ),
      },
    ],
    [navigate, routePath],
  );

  return (
    <ProjectTableWrapper ref={wrapperRef}>
      <CustomSpinSuspense spinning={getProjectListQuery.isLoading}>
        <Table pagination={false} dataSource={projects} columns={columns} />

        <StyledPagination
          onChange={page => {
            setParams(s => ({ ...s, page }));
          }}
          showSizeChanger
          pageSize={params.take}
          onShowSizeChange={onShowSizeChange}
          total={total}
        />
      </CustomSpinSuspense>
    </ProjectTableWrapper>
  );
}

export default ProjectTable;
