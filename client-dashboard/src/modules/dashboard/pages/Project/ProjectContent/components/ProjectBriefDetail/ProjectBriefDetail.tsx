import React, { Fragment, useMemo } from 'react';
import { useGetProjectByIdQuery } from '@pages/Project';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { MOMENT_FORMAT } from '@/enums';
import { Button, Divider, Tooltip } from 'antd';
import { IOptionItem } from '@/type';
import { CopyOutlined } from '@ant-design/icons';

const Item = (input: IOptionItem) => {
  const { label, value } = input;
  return (
    <div className={'text-[16px]'}>
      <span className={'font-semibold'}>{label}: </span>
      <span>{value}</span>
    </div>
  );
};

const ProjectBriefDetail = () => {
  const params = useParams<{ projectId?: string }>();
  const { project, isLoading } = useGetProjectByIdQuery(params?.projectId);
  const { t } = useTranslation();

  const data = useMemo<IOptionItem[]>(
    () => [
      {
        label: t('common.projectId'),
        value: project.displayId,
      },
      {
        label: t('common.type'),
        value: t(`projectType.${project.type}`),
      },
      {
        label: t('common.personInCharge'),
        value: `${project.personResponsible?.firstName || ''} ${
          project.personResponsible?.lastName || ''
        }`,
      },
      {
        label: t('common.creationDate'),
        value: moment(project.createdAt).format(MOMENT_FORMAT.DOB),
      },
    ],
    [
      project.createdAt,
      project.displayId,
      project.personInCharge,
      project.type,
      t,
    ],
  );

  return (
    <>
      <Divider className={'m-0'} />
      <div className={'flex items-center gap-3 py-3 px-8'}>
        {data.map(item => {
          return (
            <Fragment key={item.value}>
              <Item label={item.label} value={isLoading ? '...' : item.value} />
              <Divider
                type="vertical"
                style={{ margin: '0 16px', height: 8 }}
              />
            </Fragment>
          );
        })}
        <Item label={t('common.description')} value={''} />
        <Tooltip title={project.description}>
          <Button icon={<CopyOutlined />} type={'text'} className={'info-btn'}>
            {t('common.view')}
          </Button>
        </Tooltip>
      </div>
      <Divider className={'m-0'} />
    </>
  );
};

export default ProjectBriefDetail;
