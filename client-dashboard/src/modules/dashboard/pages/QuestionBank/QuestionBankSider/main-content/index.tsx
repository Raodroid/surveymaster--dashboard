import React, { useCallback, useMemo, useRef } from 'react';
import { QuestionBankSiderMainContentWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../enums';
import { Menu, MenuProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import useParseQueryString from '../../../../../../hooks/useParseQueryString';
import { ArrowDown } from '../../../../../../icons';
import templateVariable from '../../../../../../app/template-variables.module.scss';
import qs from 'qs';
import { useGetAllCategories } from '../../util';

import SimpleBarReact from 'simplebar-react';
import HannahCustomSpin from '../../../../components/HannahCustomSpin';

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: ItemType[],
  type?: 'group',
): ItemType => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as unknown as ItemType;
};

const QuestionBankSiderMainContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isViewCategory = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT,
    caseSensitive: false,
    end: true,
  });

  const params = useParseQueryString<{
    categoryIds?: string[];
    subCategoryIds?: string[];
  }>();

  const { categoryIds, subCategoryIds } = params;

  const selectedKey = subCategoryIds;
  const openKey = categoryIds;

  const onOpenChange: MenuProps['onOpenChange'] = useCallback(
    keys => {
      const nextQueryString = qs.stringify({
        categoryIds: keys,
      });
      navigate(
        `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT}?${nextQueryString}`,
      );
    },
    [navigate],
  );
  const handleOnSelect = useCallback(
    ({ key }) => {
      const nextQueryString = qs.stringify({
        categoryIds: openKey,
        subCategoryIds: [key],
      });
      navigate(
        `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT}?${nextQueryString}`,
      );
    },
    [navigate, openKey],
  );

  const { categories, isLoading } = useGetAllCategories();

  const transformedCategories = useMemo<ItemType[]>(
    () =>
      categories.map(i =>
        getItem(
          i.name,
          i?.id as string,
          <ArrowDown
            className={'arrow-menu-icon'}
            style={{ color: templateVariable.primary_color, height: 5 }}
          />,
          i.children?.map(child => getItem(child.name, child?.id as string)),
        ),
      ),
    [categories],
  );

  const ref = useRef<any>();

  return (
    <QuestionBankSiderMainContentWrapper>
      <div
        onClick={() => {
          navigate(ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT);
        }}
        className={`${
          isViewCategory && 'active-status'
        } QuestionBankSiderMainContent__title`}
      >
        <h4>{t('common.questionBank')}</h4>
      </div>
      <div className={'QuestionBankSiderMainContent__body'} ref={ref}>
        <HannahCustomSpin parentRef={ref} spinning={isLoading} />

        <SimpleBarReact
          style={{ height: 'calc(100% - 40px)', overflowX: 'hidden' }}
        >
          <div className={'category-list'}>
            <Menu
              expandIcon={() => null}
              mode="inline"
              openKeys={openKey}
              style={{ width: '100%' }}
              selectedKeys={selectedKey}
              onOpenChange={onOpenChange}
              items={transformedCategories}
              onSelect={handleOnSelect}
            />
          </div>
        </SimpleBarReact>
      </div>
    </QuestionBankSiderMainContentWrapper>
  );
};

export default QuestionBankSiderMainContent;
