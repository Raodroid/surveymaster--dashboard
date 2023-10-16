import React, { useCallback, useState } from 'react';
import { Tree } from 'antd';
import { DataNode, TreeProps } from 'antd/es/tree';
import QuesionTestBlock from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyTree/RenderTittle';
import { SubSurveyFlowElement, SubSurveyFlowElementDto } from '@/type';

type X = Omit<SubSurveyFlowElementDto, 'children'> &
  DataNode & { title?: React.ReactNode | ((data: X) => React.ReactNode) };

export type Z = X & { children?: X[] };

const loop = (
  data: DataNode[],
  key: React.Key,
  callback: (node: DataNode, i: number, data: DataNode[]) => void,
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

export const abc: Array<Z> = [
  {
    title: d => {
      return <QuesionTestBlock record={d} />;
    },
    key: 'p1_0',
    type: SubSurveyFlowElement.BLOCK,
    sort: 1,
    children: [
      {
        title: d => {
          return d.blockDescription;
        },
        blockDescription: 'ABH',
        key: 'p1_0_0',
        type: SubSurveyFlowElement.BRANCH,
        sort: 0,
      },
    ],
  },
  {
    title: d => {
      return <QuesionTestBlock record={d} />;
    },
    key: 'p2_1',
    type: SubSurveyFlowElement.BRANCH,
    sort: 2,
    children: [
      {
        title: d => {
          return d.blockDescription;
        },
        blockDescription: 'chhild parent 111',
        key: 'p2_1_0',
        type: SubSurveyFlowElement.BRANCH,
        sort: 0,
        children: [
          {
            title: d => {
              return d.blockDescription;
            },
            blockDescription: 'chhild parent 111',
            key: 'p2_1_0_0',
            type: SubSurveyFlowElement.BRANCH,
            sort: 0,
          },
          {
            title: d => {
              return d.blockDescription;
            },
            blockDescription: 'chhild parent 222',
            key: 'p2_1_0_1',
            type: SubSurveyFlowElement.BRANCH,
            sort: 0,
          },
        ],
      },
      {
        title: d => {
          return d.blockDescription;
        },
        blockDescription: 'chhild parent 222',
        key: 'p2_1_1',
        type: SubSurveyFlowElement.BRANCH,
        sort: 0,
      },
    ],
  },
];

const SurveyTree = () => {
  const [gData, setGData] = useState<DataNode[]>(abc);

  const onDrop: TreeProps['onDrop'] = useCallback(info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    console.log({ dropKey, dragKey, info });

    //prevent drag
    //case 1
    setGData(oldState => {
      const data = [...oldState];
      debugger;
      // Find dragObject
      let dragObj: DataNode;
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
        let ar: DataNode[] = [];
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
      return data;
    });
  }, []);

  return (
    <div className={'w-screen'}>
      <Tree draggable blockNode onDrop={onDrop} treeData={gData} />
    </div>
  );
};

export default SurveyTree;
