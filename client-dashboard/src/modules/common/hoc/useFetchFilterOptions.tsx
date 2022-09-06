import { useMemo } from 'react';
import { useQueries } from 'react-query';
import { AddressService } from 'services';
import { Entities } from 'enums/general';
import { IPagination, FetchParamsSelect } from 'type';
import { checkSpecialAddressCase } from 'utils/funcs';

export const SELECT_ENTITIES = {
  [Entities.ADDRESS]: {
    method: AddressService.getAddresses,
    entity: Entities.ADDRESS,
  },
};

interface Iprop {
  entity: Entities;
  params: IPagination | FetchParamsSelect;
  isLabelDisplayId?: boolean;
}

export const formatOption = (
  entity: Entities,
  data: any[],
  isLabelDisplayId?: boolean,
) => {
  if (!data) return [];
  switch (entity) {
    case Entities.ADDRESS:
      return data.map(item => {
        if (checkSpecialAddressCase(item))
          return {
            value: item.id,
            label: `${item.street}, ${item.street2}, ${
              item.unitNumber || '--'
            },${item.postalCode},${item.countryName}`,
          };
        return {
          value: item.id,
          label: `${item.street}, ${item.street2}, ${item.unitNumber || '--'},${
            item.postalCode
          }, ${item.stateName}, ${item.cityName}, ${item.countryName}`,
        };
      });
  }
};

const useFetchFilterOption = (props: Iprop[]) => {
  const queries = useQueries(
    props.map(item => {
      return {
        queryKey: [`${item.entity}_fetch`, item.params],
        queryFn: () => SELECT_ENTITIES[item.entity].method(item.params as any),
      };
    }),
  );

  return useMemo(
    () =>
      queries.map((item: any, index) =>
        formatOption(
          props[index].entity,
          item?.data?.data?.data || item?.data?.data.datas,
          props[index].isLabelDisplayId,
        ),
      ),
    [queries, props],
  );
};

export default useFetchFilterOption;
