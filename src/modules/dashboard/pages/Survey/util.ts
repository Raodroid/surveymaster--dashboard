import {
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import { ISurveyVersion } from '@/type';
import { SurveyService } from '@/services';
import _get from 'lodash/get';
import { saveBlob } from '@/utils';
import { MOMENT_FORMAT } from '@/enums';
import moment from 'moment';

const getParentBlockSort = (fieldName: string): number => {
  return Number(getParentFieldName(fieldName)?.match(/\[([0-9+])\]$/)?.[1]);
};

const getParentFieldName = (fieldName: string): string | undefined => {
  return fieldName.match(/(.*)\.children.*$/)?.[1];
};

const getParentChildrenFieldName = (fieldName: string) =>
  fieldName?.match(/(.*(?=\[))(.*(?=\[))/)?.[0] ||
  rootSurveyFlowElementFieldName;

const calcLevelNodeByFieldName = (fieldName: string): string[] | null => {
  return fieldName.match(/\[[0-9]+\]/gm);
};

const getBranchLevel = (fieldName: string) =>
  fieldName.match(/([0-9]+)\]$/)?.[1];

const genDefaultBlockDescription = (fieldName: string): string =>
  fieldName.match(/([0-9]+)/gm)?.reduce((res, i, idx, arr) => {
    const blockOrder = Number(i) + 1;
    return `${res} ${idx === arr.length - 1 ? blockOrder : `${blockOrder}/`}`;
  }, 'Block ') || '';

const transformToSurveyDataTreeNode = (
  data: SurveyDataTreeNode[],
  parentFieldName?: string,
): SurveyDataTreeNode[] => {
  return (data || []).map((i, index) => {
    const fieldName = genFieldName(parentFieldName, index);

    const { children, ...rest } = i;

    return {
      ...rest,
      key: fieldName,
      fieldName,
      children: !children
        ? []
        : transformToSurveyDataTreeNode(children, fieldName),
    };
  });
};

const createDuplicateSurveyVersionName = (currentName?: string): string =>
  `${currentName || ''} (Copy)`;

const updateExpandKeysAfterInsertNewBlock = (
  fieldName: string,
  oldExpandKey: Array<string>,
): string[] => {
  const getKeys = (input: string): string[] => {
    return input.match(/([0-9]+)/gm) || [];
  };

  const parentLevels = getKeys(fieldName);
  const parentLevelsLength = parentLevels.length;

  const parentFieldName = getParentFieldName(fieldName);

  const store: Record<string, string> = {};

  const sortedOldExpandKey = oldExpandKey.sort((a, b) => a.length - b.length); // Sort the parent will come first

  return sortedOldExpandKey.map(i => {
    //check key in different parent level
    if (parentFieldName !== getParentFieldName(i)) {
      const theOne = Object.keys(store).find(j => i.includes(j));
      if (theOne) {
        return i.replace(theOne, store[theOne]);
      }
      return i;
    }

    const levelKeys = getKeys(i);

    return levelKeys.reduce((res, order, index) => {
      let updateLevel;
      //calc new level for current key
      if (index === parentLevelsLength - 1) {
        if (Number(order) < Number(parentLevels.at(-1))) {
          updateLevel = order;
        } else {
          updateLevel = Number(order) + 1;
        }
      } else {
        updateLevel = order;
      }
      // update expand key
      if (index !== 0) {
        res = `${res}.children[${updateLevel}]`;
      } else {
        res = `${res}[${updateLevel}]`;
      }
      store[i] = res;
      return res;
    }, rootSurveyFlowElementFieldName);
  });
};

const genBlockSort = (maxBlockSort: number): number => {
  return maxBlockSort + 1;
};

const genFieldName = (parentFieldName: string | undefined, index: number) => {
  return !parentFieldName
    ? `${rootSurveyFlowElementFieldName}[${index}]`
    : `${parentFieldName}.children[${index}]`;
};

const handleExportSurvey = async (record: ISurveyVersion) => {
  try {
    const response = await SurveyService.getSurveyFile(record.id as string);
    const data: {
      SurveyElements: unknown[];
      SurveyEntry: { SurveyName: string };
    } = _get(response, 'data', {});
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/octet-stream',
    });
    saveBlob(
      blob,
      `${data.SurveyEntry.SurveyName}-${moment().format(
        MOMENT_FORMAT.EXPORT,
      )}.qsf`,
    );
  } catch (error) {
    console.error({ error });
  }
};

export {
  calcLevelNodeByFieldName,
  getParentChildrenFieldName,
  getParentFieldName,
  getParentBlockSort,
  getBranchLevel,
  transformToSurveyDataTreeNode,
  createDuplicateSurveyVersionName,
  genDefaultBlockDescription,
  updateExpandKeysAfterInsertNewBlock,
  genBlockSort,
  genFieldName,
  handleExportSurvey,
};
