import { merge, RecordOf } from 'immutable';
import { MetaAction, PayloadAction } from './types';
import {
  ReduxModules,
  IndexesType,
  ReduxCollections,
  ReduxIndexes,
} from 'enums';

export const createAction = <Type extends string, Meta, Error, Function>(
  type: Type,
  meta?: Meta,
  error?: Error,
  callback?: Function,
): MetaAction<Type, Meta, Error, Function> => ({
  type,
  meta,
  error,
  callback,
});

export const createPayloadAction = <
  Type extends string,
  Payload,
  Meta,
  Error,
  Function,
>(
  type: Type,
  payload?: Payload,
  meta?: Meta,
  error?: Error,
  callback?: Function,
): PayloadAction<Type, Payload, Meta, Error, Function> => ({
  ...createAction(type, meta, error, callback),
  payload,
});

export const normalizeArr = <T>(
  array: T[],
  keyName: string = 'id',
): Record<string, T> => {
  const normalizedObj: Record<string, T> = {};
  array.forEach(item => {
    normalizedObj[item[keyName]] = item;
  });
  return normalizedObj;
};

// The function return initial state for indexes of a reducer
export const generateIndexes = (reducer: ReduxModules): IndexesType => {
  const result = ReduxIndexes[reducer].reduce((indexes, indexKey) => {
    indexes[indexKey] = {};
    return indexes;
  }, {});
  return result as IndexesType;
};

// The function return new state of a reducer after update data & update indexing data
// mergeStategy default is merge (top level), if you want to merge deep

export const updateAndIndexingData = <T, Y extends object>(
  dataRows: T[],
  reducer: ReduxModules,
  currentState: RecordOf<Y>,
  isPartial: boolean = false,
  key: string = 'id', // Key of data want to add to index, it should be unique field of data
): RecordOf<Y> => {
  let state = currentState;
  const normalizedData = normalizeArr(dataRows);
  const getCurrentIndexes = (index: string) => {
    return (state as any).indexes[index];
  };
  ReduxIndexes[reducer].forEach((index: string) => {
    dataRows.forEach((currentItem: any) => {
      let item = currentItem;
      const previousItem = state.get(ReduxCollections[reducer])[item[key]];
      // Begin Handle merge if there is partial update
      if (isPartial) {
        item = merge(previousItem || {}, item);
        state = state.setIn([ReduxCollections[reducer], item[key]], item);
      }
      // End Handle merge if there is partial update

      // Begin process data & add new indexing to state
      let currentIndex = getCurrentIndexes(index);
      const itemIndex = item[index];
      if (!(currentIndex[itemIndex] || []).includes(item[key])) {
        state = state.setIn(
          ['indexes', index, itemIndex],
          Array.isArray(currentIndex[itemIndex])
            ? [...currentIndex[itemIndex], item[key]]
            : [item[key]],
        );
      }
      // End process data & add new indexing to state

      // Begin process data & add remove indexing to state if needed
      currentIndex = getCurrentIndexes(index);
      const previousItemIndex = previousItem && previousItem[index];
      if (previousItem && previousItemIndex !== itemIndex) {
        const updatedIndexes = (currentIndex[previousItem[index]] || []).filter(
          id => id !== item[key],
        );
        state = state.setIn(
          ['indexes', index, previousItemIndex],
          updatedIndexes,
        );
      }
      // End process data & add remove indexing to state if needed
    });
  });
  const currentData = state[ReduxCollections[reducer]];
  // If there is not partical update we should merge on collection level to faster insert to state
  if (!isPartial) {
    state = state.set(
      ReduxCollections[reducer],
      merge(currentData, normalizedData),
    );
  }
  return state;
};
