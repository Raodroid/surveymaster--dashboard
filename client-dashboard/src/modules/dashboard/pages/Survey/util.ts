export const getParentBlockSort = (parentLayerFieldName: string): number => {
  return Number(
    parentLayerFieldName
      .match(/(.*)\.children.*$/)?.[1]
      ?.match(/\[([0-9+])\]$/)?.[1],
  );
};
