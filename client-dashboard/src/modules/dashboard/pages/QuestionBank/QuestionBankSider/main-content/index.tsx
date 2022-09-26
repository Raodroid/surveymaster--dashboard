import React, { useMemo } from 'react';
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
    category?: string;
    subCategory?: string;
  }>();

  const { category, subCategory } = params;

  const selectedKey = subCategory ? [subCategory] : undefined;
  const openKey = category ? [category] : undefined;

  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    const keyLength = keys.length;
    if (keyLength) {
      const lastKey = keys[keyLength - 1];
      navigate(
        `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT}?category=${lastKey}`,
      );
    }
  };
  const handleOnSelect = ({ key }) => {
    navigate(
      `${ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.ROOT}?category=${openKey}&subCategory=${key}`,
    );
  };
  const baseParams = useMemo(
    () => ({
      page: 1,
      take: 10,
    }),
    [],
  );

  const getCategoryQuery = useQuery(
    ['getCategories', baseParams],
    () => QuestionBankService.getCategories(baseParams),
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
          undefined,
          i.children?.map(child => getItem(child.name, child?.id as string)),
        ),
      ),
    [categories],
  );

  return (
    <QuestionBankSiderMainContentWrapper>
      <div
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
