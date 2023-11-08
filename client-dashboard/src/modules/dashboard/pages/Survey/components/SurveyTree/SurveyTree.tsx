import React, { useCallback } from 'react';
import { Tree } from 'antd';
import { DataNode, TreeProps } from 'antd/es/tree';
import { useField } from 'formik';
import {
  getParentNodeFieldName,
  transformToSurveyDataTreeNode,
} from '@pages/Survey/components/SurveyTree/util';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import {
  questionValueType,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import { SubSurveyFlowElement } from '@/type';
import _get from 'lodash/get';
import { DragHandle } from '@/customize-components';
import { useSurveyFormContext } from '@pages/Survey';
import QuestionBranchIcon from '@pages/SurveyNew/components/QuestionBranchIcon/QuestionBranchIcon';

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

const SurveyTree = () => {
  const [{ value }, , { setValue: setGData }] = useField<
    Array<SurveyDataTreeNode>
  >(rootSurveyFlowElementFieldName);

  const { handleFocusBlock } = useSurveyFormContext();
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
    [value, setGData],
  );

  return (
    <div className={''}>
      <Tree
        onSelect={(key, node) => {
          handleFocusBlock(node.node as unknown as SurveyDataTreeNode);
        }}
        draggable={
          isViewMode
            ? false
            : {
                icon: <DragHandle />,
              }
        }
        titleRender={d => (
          <>
            <QuestionBranchIcon type={d?.type} />
          </>
        )}
        // titleRender={d => <QuestionBlock record={d as SurveyDataTreeNode} />}
        blockNode
        onDrop={onDrop}
        treeData={value as DataNode[]}
      />
    </div>
  );
};

export default SurveyTree;
