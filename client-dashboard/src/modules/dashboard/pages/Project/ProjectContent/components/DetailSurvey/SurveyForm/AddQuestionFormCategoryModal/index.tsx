import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Input, Menu, MenuProps, ModalProps, Spin } from 'antd';
import { IGetParams, IQuestionCategory } from 'type';
import { useQuery } from 'react-query';
import { QuestionBankService } from 'services';
import { useDebounce, onError } from 'utils';
import {
  AddQuestionFormCategoryModalWrapper,
  CategoryMenuWrapper,
} from './style';
import { DisplayQuestionList } from './DisplayQuestionList/DisplayQuestionList';
import { useTranslation } from 'react-i18next';
import HannahCustomSpin from '../../../../../../../components/HannahCustomSpin';

const initParams = {
  take: 10,
  page: 1,
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}
const AddQuestionFormCategoryModal: FC<ModalProps> = props => {
  const { open, onCancel } = props;
  const [searchTxt, setSearchTxt] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const wrapperRef = useRef<any>();

  const { t } = useTranslation();

  const debounceSearchText = useDebounce(searchTxt);

  const currentParam = useMemo<IGetParams>(
    () => ({
      ...initParams,
      selectAll: true,
      q: debounceSearchText,
    }),
    [debounceSearchText],
  );

  const getCategoryListQuery = useQuery(
    ['getCategoryList', currentParam],
    () => {
      return QuestionBankService.getCategories(currentParam);
    },
    { onError, enabled: open, refetchOnWindowFocus: false },
  );

  const categoryData = useMemo(() => {
    if (!getCategoryListQuery.data) return [];
    return getCategoryListQuery.data.data.data.reduce(
      (current: MenuItem[], category: IQuestionCategory) => {
        return [...current, getItem(category.name, category.id)];
      },
      [],
    );
  }, [getCategoryListQuery.data]);

  const handleTyping = useCallback(
    e => {
      setSearchTxt(e.target.value);
      setSelectedCategoryId('');
    },
    [setSearchTxt],
  );
  const handleSelect = useCallback(({ key }) => {
    setSelectedCategoryId(key);
  }, []);

  return (
    <AddQuestionFormCategoryModalWrapper {...props} footer={false} centered>
      <div className={'category-column'} ref={wrapperRef}>
        <HannahCustomSpin
          parentRef={wrapperRef}
          spinning={getCategoryListQuery.isLoading}
        />
        <Input
          className={'search-input'}
          allowClear
          placeholder={`${t('common.searchCategory')}...`}
          value={searchTxt}
          onChange={handleTyping}
        />
        <CategoryMenuWrapper items={categoryData} onSelect={handleSelect} />
      </div>
      <DisplayQuestionList
        selectedCategoryId={selectedCategoryId}
        onClose={onCancel}
      />
    </AddQuestionFormCategoryModalWrapper>
  );
};

export default AddQuestionFormCategoryModal;
