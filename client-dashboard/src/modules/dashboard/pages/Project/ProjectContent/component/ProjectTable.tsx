import { Button, Menu, Pagination, Table } from 'antd';
import CustomTable from 'customize-components/CustomTable';
import ThreeDotsDropdown from 'customize-components/ThreeDotsDropdown';
import { ROUTE_PATH } from 'enums';
import { PenFilled } from 'icons';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import ProjectService from 'services/survey-master-service/project.service';
import { BooleanEnum } from 'type';
import { ProjectTableWrapper } from '../style';
import { ColumnsType } from 'antd/lib/table/interface';
import _get from 'lodash/get';
import { onError, useDebounce } from '../../../../../../utils';
import HannahCustomSpin from '../../../../components/HannahCustomSpin';
import useParseQueryString from '../../../../../../hooks/useParseQueryString';
import StyledPagination from '../../../../components/StyledPagination';
import { useTranslation } from 'react-i18next';
import { QuestionBankService, SurveyService } from '../../../../../../services';
import { ItemType } from 'antd/es/menu/hooks/useItems';

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

function ProjectTable() {
  const wrapperRef = useRef<any>();
  const [searchTxt, setSearchTxt] = useState<string>('');
  const queryString = useParseQueryString<GetListQuestionDto>();
  const navigate = useNavigate();

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

  const columns = useMemo<ColumnsType<IProject>>(
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
              ROUTE_PATH.DASHBOARD_PATHS.PROJECT.SURVEY.replace(
                ':id',
                record?.id,
              ) + `?title=${record.name}`
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
            {record.personResponsible.firstName}{' '}
            {record.personResponsible.lastName}
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
        render: (value, _: any) => (
          <div className="flex-center actions">
            <Button
              onClick={() =>
                navigate(
                  ROUTE_PATH.DASHBOARD_PATHS.PROJECT.PROJECT.EDIT.replace(
                    ':id',
                    _.project.displayId,
                  ),
                )
              }
            >
              <PenFilled />
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  useEffect(() => {
    setParams({ ...initParams, ...queryString });
  }, [queryString]);

  return (
    <ProjectTableWrapper ref={wrapperRef}>
      <Table pagination={false} dataSource={projects} columns={columns} />
      <HannahCustomSpin
        parentRef={wrapperRef}
        spinning={getProjectListQuery.isLoading}
      />
      <StyledPagination
        onChange={page => {
          setParams(s => ({ ...s, page }));
        }}
        showSizeChanger
        pageSize={params.take}
        onShowSizeChange={onShowSizeChange}
        total={total}
      />
    </ProjectTableWrapper>
  );
}

export default ProjectTable;
