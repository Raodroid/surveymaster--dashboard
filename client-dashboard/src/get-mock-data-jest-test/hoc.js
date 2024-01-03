import {i18nInit} from '../locales/i18n';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MemoryRouter} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';

export const JestGeneralProviderHoc = props => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <I18nextProvider i18n={i18nInit}>{props.children}</I18nextProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});
export const wrapperQuery = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
