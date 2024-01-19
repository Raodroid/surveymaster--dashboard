import { Button, Dropdown } from 'antd';
import { ThreeDotsIcon } from '@/icons';
import { FC, ReactNode } from 'react';
import { IMenuItem } from '@/type';
import { DropdownProps } from 'antd/lib/dropdown/dropdown';
import { useToggle } from '@/utils';
import styled from 'styled-components/macro';
import { ButtonProps } from 'antd/lib/button';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

interface IThreeDotsDropdown extends Omit<DropdownProps, 'overlay'> {
  items: Array<ItemType>;
  onChooseItem: (key: any) => void;
  size?: ButtonProps['size'];
  title?: string | ReactNode;
}

const ThreeDotsDropdown: FC<IThreeDotsDropdown> = props => {
  const { items, onChooseItem, size, title, ...res } = props;

  const [state, toggleOpen] = useToggle();

  if (!items || items.length === 0) return null;

  return (
    <>
      <DropdownWrapper
        overlayClassName={'[&>ul>li]:!my-[10px] [&>ul>li>svg]:w-[25px]'}
        menu={{
          onClick: e => {
            onChooseItem(e.key);
            toggleOpen();
          },
          items: items,
        }}
        placement={'bottomRight'}
        trigger={['click']}
        open={state}
        onOpenChange={toggleOpen}
        {...res}
      >
        <Button
          type={'text'}
          aria-label={'three drop down'}
          size={size}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <div className={'flex items-center gap-3'}>
            <ThreeDotsIcon />
            {title}
          </div>
        </Button>
      </DropdownWrapper>
    </>
  );
};

export default ThreeDotsDropdown;

const DropdownWrapper = styled(Dropdown)`
  .ant-dropdown {
    .ant-dropdown-menu {
      .ant-dropdown-menu-item {
        margin: 17px 10px;
      }
    }
  }
`;
