import { IQuestion } from '../../../../../../../type';
import React, { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useCheckScopeEntityDefault } from '../../../../../../common/hoc';
import { ROUTE_PATH, SCOPE_CONFIG } from '../../../../../../../enums';
import { QuestionBankService } from '../../../../../../../services';
import { Menu, Modal, notification } from 'antd';
import { generatePath } from 'react-router';
import {
  FileIconOutlined,
  PenFilled,
  TrashOutlined,
} from '../../../../../../../icons';
import { MenuDropDownWrapper } from '../../../../../../../customize-components/styles';
import ThreeDotsDropdown from '../../../../../../../customize-components/ThreeDotsDropdown';
import { CategoryDetailContext } from '../../index';
import { onError } from '../../../../../../../utils';

const { Item } = Menu;
const { confirm } = Modal;

enum ACTION_ENUM {
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
  DUPLICATE = 'DUPLICATE',
  EDIT = 'EDIT',
}

interface IDropDownMenu {
  record: IQuestion;
}

export const CategoryThreeDropDown: FC<IDropDownMenu> = props => {
  const { record } = props;
  const isDeleted = record?.deletedAt;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const context = useContext(CategoryDetailContext);
  const setLoading = context?.setLoading;
  const navigate = useNavigate();
  const { canCreate, canDelete, canUpdate } = useCheckScopeEntityDefault(
    SCOPE_CONFIG.ENTITY.QUESTIONS,
  );

  const deleteMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.deleteQuestion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.deleteSuccess') });
      },
      onError,
    },
  );

  const restoreMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.restoreQuestionByQuestionId(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.restoreSuccess') });
      },
      onError,
    },
  );

  const duplicateMutation = useMutation(
    (data: { id: string }) => {
      return QuestionBankService.duplicateQuestion(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('getQuestionList');
        notification.success({ message: t('common.duplicateSuccess') });
      },
      onError,
    },
  );

  const handleSelect = useCallback(
    async (props: { record: IQuestion; key: string }) => {
      const { key, record } = props;
      switch (key) {
        case ACTION_ENUM.DELETE: {
          confirm({
            icon: null,
            content: t('common.confirmDeleteQuestion'),
            onOk() {
              deleteMutation.mutateAsync({ id: record.id as string });
            },
          });
          break;
        }
        case ACTION_ENUM.DUPLICATE: {
          confirm({
            icon: null,
            content: t('common.confirmDuplicateQuestion'),
            onOk() {
              duplicateMutation.mutateAsync({ id: record.id as string });
            },
          });
          break;
        }
        case ACTION_ENUM.RESTORE: {
          confirm({
            icon: null,
            content: t('common.confirmRestoreQuestion'),
            onOk() {
              restoreMutation.mutateAsync({ id: record.id as string });
            },
          });
          break;
        }
        case ACTION_ENUM.EDIT: {
          navigate(
            generatePath(
              ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.EDIT_QUESTION,
              { questionId: record.id },
            ) + `?version=${record.latestVersion.displayId}`,
          );
          break;
        }
      }
    },
    [t, deleteMutation, duplicateMutation, restoreMutation, navigate],
  );

  const items = useMemo(() => {
    const baseMenu: any = [];

    if (isDeleted) {
      if (canUpdate) {
        baseMenu.push(
          <Item key={ACTION_ENUM.RESTORE} icon={<PenFilled />}>
            {t('common.duplicateQuestion')}
          </Item>,
        );
      }
    } else {
      if (canCreate) {
        baseMenu.push(
          <Item key={ACTION_ENUM.DUPLICATE} icon={<FileIconOutlined />}>
            {t('common.duplicateQuestion')}
          </Item>,
        );
        // baseMenu.push(
        //   <Popconfirm
        //     placement="rightTop"
        //     title={`${t('common.duplicate')} question [${
        //       record?.latestVersion?.title
        //     }]`}
        //     onConfirm={() =>
        //       handleSelect({ record, key: ACTION_ENUM.DUPLICATE })
        //     }
        //     okText="Yes"
        //     cancelText="No"
        //   >
        //     <Item key={ACTION_ENUM.DUPLICATE} icon={<FileIconOutlined />}>
        //       {t('common.duplicateQuestion')}
        //     </Item>
        //   </Popconfirm>,
        // );
      }
      if (canUpdate) {
        baseMenu.push(
          <Item key={ACTION_ENUM.EDIT} icon={<PenFilled />}>
            {t('common.editQuestion')}
          </Item>,
        );
      }
      if (canDelete) {
        baseMenu.push(
          <Item key={ACTION_ENUM.DELETE} icon={<TrashOutlined />}>
            {t('common.deleteQuestion')}
          </Item>,
        );
      }
    }

    return baseMenu;
  }, [isDeleted, canUpdate, t, canCreate, canDelete]);

  const menu = (
    <MenuDropDownWrapper onClick={({ key }) => handleSelect({ key, record })}>
      {items}
    </MenuDropDownWrapper>
  );

  useEffect(() => {
    if (setLoading) {
      const isLoading =
        duplicateMutation.isLoading ||
        deleteMutation.isLoading ||
        restoreMutation.isLoading;
      setLoading(isLoading);
    }
  }, [deleteMutation, restoreMutation, duplicateMutation, setLoading]);

  if (items.length === 0) return null;

  return (
    <ThreeDotsDropdown
      overlay={menu}
      placement="bottomLeft"
      trigger={'click' as any}
    />
  );
};
