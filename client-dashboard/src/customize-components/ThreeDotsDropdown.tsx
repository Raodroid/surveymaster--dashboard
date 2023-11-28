import { Button, Dropdown } from 'antd';
import { ThreeDotsIcon } from '@/icons';
import React from 'react';
import { IMenuItem } from '@/type';
import { DropdownProps } from 'antd/lib/dropdown/dropdown';
import { useToggle } from '@/utils';
import styled from 'styled-components/macro';

interface IThreeDotsDropdown extends Omit<DropdownProps, 'overlay'> {
  items: Array<IMenuItem>;
  onChooseItem: (key: any) => void;
}

const ThreeDotsDropdown: React.FC<IThreeDotsDropdown> = props => {
  const { items, onChooseItem, ...res } = props;

  const [state, toggleOpen] = useToggle();

  if (!items || items.length === 0) return null;

  return (
    <>
      <DropdownWrapper
        overlayClassName={'[&>ul>li]:!my-[10px]'}
        menu={{
          onClick: e => {
            onChooseItem(e.key);
            toggleOpen();
          },
          items: items.map(i => ({
            icon: i.icon,
            label: i.label,
            key: i.key,
          })),
        }}
        placement={'bottomRight'}
        trigger={['click']}
        open={state}
        onOpenChange={toggleOpen}
        {...res}
      >
        <Button type={'text'} ghost aria-label={'three drop down'}>
          <ThreeDotsIcon />
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
