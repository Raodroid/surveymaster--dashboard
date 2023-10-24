import { useCallback, useMemo } from 'react';
import { Tree } from 'antd';
import { DataNode, TreeProps } from 'antd/es/tree';
import templateVariable from '@/app/template-variables.module.scss';
import { DragIcon } from '@/icons';
import { useField } from 'formik';
import {
  SurveyDataTreeNode,
  transformToSurveyDataTreeNode,
} from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyTree/util';
import QuestionTestBlock from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/Components/SurveyFlow/SurveyTree/RenderTittle';
import * as React from 'react';
import { useCheckSurveyFormMode } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/util';

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
  >('version.surveyFlowElements');

  const { isViewMode } = useCheckSurveyFormMode();

  // const gData = useMemo(() => {
  //   return transformToSurveyDataTreeNode(value);
  // }, [value]);

  const onDrop: TreeProps['onDrop'] = useCallback(
    info => {
      const dropKey = info.node.key;
      const dragKey = info.dragNode.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const data = [...value];
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
        ((info.node as any).props.children || []).length > 0 && // Has children
        (info.node as any).props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
          item.children.unshift(dragObj);
          // in previous version, we use item.children.push(dragObj) to insert the
          // item to the tail of the children
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
        draggable={
          isViewMode
            ? false
            : {
                icon: (
                  <DragIcon
                    style={{
                      cursor: 'grab',
                      color: templateVariable.text_primary_color,
                    }}
                  />
                ),
              }
        }
        titleRender={d => (
          <QuestionTestBlock record={d as SurveyDataTreeNode} />
        )}
        blockNode
        onDrop={onDrop}
        treeData={value as DataNode[]}
      />
    </div>
  );
};

export default SurveyTree;
