import { Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React, { useCallback } from 'react';
import { useField } from 'formik';
import {
  questionValueType,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
  useCheckSurveyFormMode,
  useSurveyFormContext,
} from '@pages/Survey';
import {
  getParentNodeFieldName,
  transformToSurveyDataTreeNode,
} from '@pages/Survey/components/SurveyTree/util';
import _get from 'lodash/get';
import { SubSurveyFlowElement } from '@/type';
import { DragHandle } from '@/customize-components';
import QuestionBlock from '@pages/Survey/components/QuestionBlock/RenderTittle';
import styled from 'styled-components/macro';

const loop = (
  data: SurveyDataTreeNode[],
  key: React.Key,
  callback: (
    node: SurveyDataTreeNode,
    i: number,
    data: SurveyDataTreeNode[],
  ) => void,
) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      return callback(data[i], i, data);
    }
    if (data[i].children) {
      loop(data[i].children!, key, callback);
    }
  }
};

const SurveyStructureTree: React.FC = () => {
  const [{ value }, , { setValue: setGData }] = useField<
    Array<SurveyDataTreeNode>
  >(rootSurveyFlowElementFieldName);

  const { handleFocusBlock, form } = useSurveyFormContext();
  const { isViewMode } = useCheckSurveyFormMode();

  const onDrop: TreeProps['onDrop'] = useCallback(
    info => {
      const { node, dragNode } = info;
      const dropKey = node.key;
      const dragKey = dragNode.key;
      const dropPos = node.pos.split('-');
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const { dragOverGapBottom, dragOverGapTop } = node;
      // check posistion is valid when drag
      if (dragOverGapBottom || dragOverGapTop) {
        if (node.fieldName.match(/'RightMenu'/)) {
          const parent = getParentNodeFieldName(node.fieldName);
          const parentNode: questionValueType = _get(value, parent);
          if (parentNode && parentNode.type !== SubSurveyFlowElement.BRANCH) {
            return;
          }
        }
      } else if (node.type !== SubSurveyFlowElement.BRANCH) {
        return;
      }

      handleFocusBlock(undefined);

      const data = value;
      // Find dragObject
      let dragObj: SurveyDataTreeNode;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
          item.children.unshift(dragObj);
        });
      } else if (
        ((node as any).props.children || []).length > 0 && // Has RightMenu
        (node as any).props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
          item.children.unshift(dragObj);
          // in previous version, we use item.RightMenu.push(dragObj) to insert the
          // item to the tail of the RightMenu
        });
      } else {
        let ar: SurveyDataTreeNode[] = [];
        let i: number;
        loop(data, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i!, 0, dragObj!);
        } else {
          ar.splice(i! + 1, 0, dragObj!);
        }
      }
      setGData(transformToSurveyDataTreeNode(data));
    },
    [handleFocusBlock, value, setGData],
  );

  return (
    <WrapperTree
      onSelect={(key, node) => {
        handleFocusBlock(node.node as unknown as SurveyDataTreeNode);
      }}
      selectedKeys={form.focusBlock?.key ? [form.focusBlock.key] : []}
      draggable={
        isViewMode
          ? false
          : {
              icon: <DragHandle />,
            }
      }
      titleRender={d => <QuestionBlock record={d as SurveyDataTreeNode} />}
      blockNode
      onDrop={onDrop}
      treeData={value as DataNode[]}
      showLine
    />
  );
};

export default SurveyStructureTree;

const WrapperTree = styled(Tree)`
  padding-right: 1rem;
  .ant-tree-list-holder-inner {
  }
  .ant-tree-treenode {
    width: max-content;
  }
  .ant-tree-node-content-wrapper {
    padding: 0;
    margin-bottom: 1.5rem;
  }
  .ant-tree-title {
    border-color: #c7c7c7;
  }

  .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background: none;
    .ant-tree-title {
      border-color: black;
    }
  }
  .ant-tree-treenode.ant-tree-treenode-switcher-open {
    transform: translateX(0px);
  }
  .ant-tree-indent-unit {
    transform: translateX(-2px);
  }
`;
