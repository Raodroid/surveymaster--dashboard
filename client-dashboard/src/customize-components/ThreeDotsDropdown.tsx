import { Button, Dropdown, Menu } from 'antd';
import { ThreeDotsIcon } from '@/icons';
import React from 'react';
import { IMenuItem } from '@/type';
import { DropdownProps } from 'antd/lib/dropdown/dropdown';
import { useToggle } from '@/utils';

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
      <Dropdown
        overlay={
          <Menu>
            {items.map(i => (
              <Menu.Item
                key={i.key}
                onClick={() => {
                  onChooseItem(i.key);
                  toggleOpen();
                }}
              >
                {i.icon ? (
                  <span className={'flex gap-5 items-center'}>
                    {i.icon}
                    {i.label}
                  </span>
                ) : (
                  <p>{i.label}</p>
                )}
              </Menu.Item>
            ))}
          </Menu>
        }
        placement={'bottomRight'}
        trigger={['click']}
        open={state}
        onOpenChange={toggleOpen}
        {...res}
      >
        <Button type={'text'} ghost aria-label={'three drop down'}>
          <ThreeDotsIcon />
        </Button>
      </Dropdown>
    </>
  );
};

export default ThreeDotsDropdown;
