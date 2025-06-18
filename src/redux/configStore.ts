/**
 * Create the store with dynamic reducers
 */
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';

import { createReducer } from './rootReducer';
import RootSaga from './rootSaga';
import CustomImmutableTransform from './immutableTransform';
import CustomImmutableOrderTransform from './immutableOrderTransform';

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  // Create the store with saga middleware
  const middlewares = [sagaMiddleware];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const persistConfig = {
    transforms: [CustomImmutableTransform, CustomImmutableOrderTransform],
    key: 'root',
    storage,
    whitelist: ['auth', 'order'],
  };

  const persistedReducer = persistReducer(persistConfig, createReducer());

  const store = configureStore({
    reducer: persistedReducer,
    middleware: [...middlewares],
    devTools: import.meta.env.NODE_ENV !== 'production',
    enhancers,
  });

  const persistor = persistStore(store);

  runSaga(RootSaga);

  return { store, persistor };
}
