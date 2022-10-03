/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from 'serviceWorker';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from 'store';

// Use consistent styling
import 'sanitize.css/sanitize.css';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

// import { configureAppStore } from 'redux/configStore';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Initialize languages
import './locales/i18n';
import { notification } from 'antd';
import styled from 'styled-components/macro';

import './app/index.sass';
import { ScrollbarProvider } from './scrollbarContext/useScrollBar';
import { CloseIcon } from './icons/CloseIcon';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import customHistory from 'utils/history';

// const appConfig = configureAppStore();

// export const store = appConfig.store;
// export const persistor = appConfig.persistor;
const MOUNT_NODE =
  (document.getElementById('root') as HTMLElement) ||
  document.createElement('div'); // for testing purposes;\

const root = createRoot(MOUNT_NODE);

const CloseIconWrap = styled.div`
  height: inherit;
  width: 14px;
  svg {
    height: inherit;
    width: inherit;
  }
  :hover path {
    fill: red;
  }
`;

notification.config({
  duration: 5,
  closeIcon: (
    <CloseIconWrap>
      <CloseIcon />
    </CloseIconWrap>
  ),
});

const queryClient = new QueryClient();
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <HelmetProvider>
        <PersistGate loading={null} persistor={persistor}>
          <React.StrictMode>
            <ScrollbarProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ScrollbarProvider>
          </React.StrictMode>
        </PersistGate>
      </HelmetProvider>
    </Provider>
    <ReactQueryDevtools initialIsOpen />
  </QueryClientProvider>,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
