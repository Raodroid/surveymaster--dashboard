import { Key, ReactNode, useCallback, useMemo } from 'react';
import { QuestionBankSiderMainContentWrapper } from './style';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';
import { Menu, MenuProps, Spin } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useParseQueryString } from '@/hooks';
import { ArrowDown } from '@/icons';
import templateVariable from '@/app/template-variables.module.scss';
import qs from 'qs';
import { useGetAllCategories } from '../../util';
import { SimpleBarCustom } from '@/customize-components';

const getItem = (
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
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

  return (
    <QuestionBankSiderMainContentWrapper>
      <div
        className={`${
          isViewCategory && 'active-status'
        } mb-3 px-[1rem] py-[0.5rem] rounded-[6px]`}
      >
        <h4 className={'text-[16px] font-semibold m-0'}>
          {t('common.questionBank')}
        </h4>
      </div>
      <Spin spinning={isLoading} style={{ maxHeight: 'unset' }}>
        <div className={'h-full relative'}>
          <SimpleBarCustom>
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
          </SimpleBarCustom>
        </div>
      </Spin>
    </QuestionBankSiderMainContentWrapper>
  );
};

export default QuestionBankSiderMainContent;
