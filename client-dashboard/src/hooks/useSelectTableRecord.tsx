import { useCallback, useState } from 'react';

export type keysAction<T> = {
  key: string;
  action?: (record: T) => void;
}[];

export const useSelectTableRecord = <T,>(actions: keysAction<T>) => {
  const [selectedRecord, setSelectedRecord] = useState<T | null>(null);

  const handleSelect = useCallback(
    async (props: { record: T; key: string }) => {
      const { key, record } = props;
      setSelectedRecord(record);

      const x = actions.find((i) => i.key === key);

      if (x && x.action) {
        x.action(record);
      }
    },
    [actions],
  );

  return { selectedRecord, setSelectedRecord, handleSelect };
};
