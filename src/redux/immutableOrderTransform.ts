import { Record, RecordOf } from 'immutable';
import { createTransform } from 'redux-persist';

const CustomImmutableOrderTransform = createTransform();
// (inboundState: RecordOf<OrderProductState>) => {
//   return inboundState.toJSON();
// },
// (outboundState: OrderProductState) => {
//   return Record({
//     ...initDataCard,
//     cart: outboundState.cart || initDataCard.cart,
//   })({
//     ...initDataCard,
//     cart: outboundState.cart || initDataCard.cart,
//   });
// },
// { whitelist: [] },

export default CustomImmutableOrderTransform;
