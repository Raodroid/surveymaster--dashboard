import { Helmet } from 'react-helmet-async';
import { GlobalStyle } from 'styles/global-styles';
import { ConfigProvider } from 'antd';

import { useTranslation } from 'react-i18next';
import AppRoutes from './appRoutes';
import { AppContainer } from './style';

import 'antd/dist/antd.variable.min.css';
import './index.sass';
import './globle-varaiable.sass';
import { useEffect } from 'react';
import { DEFAULT_THEME_COLOR } from 'enums';
import { setSecondaryColor } from 'modules/common/funcs';

export function App() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  useEffect(() => {
    ConfigProvider.config({
      theme: {
        errorColor: DEFAULT_THEME_COLOR.ERROR,
        successColor: DEFAULT_THEME_COLOR.SUCCESS,
        warningColor: DEFAULT_THEME_COLOR.WARNING,
        primaryColor: DEFAULT_THEME_COLOR.PRIMARY,
      },
    });

    setSecondaryColor(DEFAULT_THEME_COLOR.SECONDARY);
  }, []);

  return (
    <AppContainer>
      <Helmet
        titleTemplate={`%s - ${t('titles.app')}`}
        defaultTitle={t('titles.app')}
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content={t('titles.app')} />
      </Helmet>
      <AppRoutes />

      <GlobalStyle />
    </AppContainer>
  );
}
