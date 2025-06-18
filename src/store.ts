import { configureAppStore } from 'redux/configStore';
const appConfig = configureAppStore();

export const store = appConfig.store;
export const persistor = appConfig.persistor;
