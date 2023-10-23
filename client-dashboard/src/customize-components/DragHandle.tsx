import { SortableHandle } from 'react-sortable-hoc';
import { DragIcon } from '@/icons';
import templateVariable from '../app/template-variables.module.scss';
import React from 'react';

const DragHandle = SortableHandle(() => (
  <DragIcon
    style={{ cursor: 'grab', color: templateVariable.text_primary_color }}
  />
));

export default DragHandle;
