import React, { useCallback, useMemo } from 'react';
import { QuestionBankSiderMainContentWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../enums';
import { useQuery } from 'react-query';
import { QuestionBankService } from '../../../../../../services';
import { onError } from '../../../../../../utils';
import _get from 'lodash/get';
import { Menu, MenuProps, Spin } from 'antd';
import { IQuestionCategory } from '../../../../../../type';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import useParseQueryString from '../../../../../../hooks/useParseQueryString';
import { ArrowDown } from '../../../../../../icons';
import templateVariable from '../../../../../../app/template-variables.module.scss';
import qs from 'qs';

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

  const getCategoryQuery = useQuery(
    ['getCategories'],
    () =>
      QuestionBankService.getCategories({
        selectAll: true,
      }),
    {
      onError,
    },
  );

  const categories = useMemo<IQuestionCategory[]>(
    () => _get(getCategoryQuery.data, 'data.data', []),
    [getCategoryQuery.data],
  );

  const transformedCategories = useMemo<ItemType[]>(
    () =>
      categories.map(i =>
        getItem(
          i.name,
          i?.id as string,
          <ArrowDown
            style={{ color: templateVariable.primary_color, height: 5 }}
          />,
          i.children?.map(child => getItem(child.name, child?.id as string)),
        ),
      ),
    [categories],
  );

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
      <Spin spinning={getCategoryQuery.isLoading}>
        <div className={'QuestionBankSiderMainContent__body'}>
          <div className={'category-list'}>
            <Menu
              expandIcon={() => null}
              mode="inline"
              openKeys={openKey}
              selectedKeys={selectedKey}
              onOpenChange={onOpenChange}
              style={{ width: 256 }}
              items={transformedCategories}
              onSelect={handleOnSelect}
            />
          </div>
        </div>
      </Spin>
    </QuestionBankSiderMainContentWrapper>
  );
};

export default QuestionBankSiderMainContent;
