import React, { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { MOMENT_FORMAT } from '@/enums';
import { Divider } from 'antd';
import { IOptionItem } from '@/type';
import { useSurveyFormContext } from '@pages/Survey';
import { IBreadcrumbItem } from '@/modules/common';

const Item = (input: IOptionItem) => {
  const { label, value } = input;
  return (
    <div className={'text-[16px]'}>
      <span className={'font-semibold'}>{label}: </span>
      <span>{value}</span>
    </div>
  );
};

const SurveyBriefDetail = (props: { routes: IOptionItem[] }) => {
  const { routes } = props;
  return (
    <>
      <Divider className={'m-0'} />
      <div className={'flex items-center gap-3 py-3 px-8'}>
        {routes.map(item => {
          return (
            <Fragment key={item.value}>
              <Item label={item.label} value={item.value || '...'} />
              <Divider
                type="vertical"
                style={{ margin: '0 16px', height: 8 }}
              />
            </Fragment>
          );
        })}
      </div>
    </>
  );
};

export default SurveyBriefDetail;
