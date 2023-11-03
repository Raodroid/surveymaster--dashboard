import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import macrosPlugin from 'vite-plugin-babel-macros';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  // depending on your application, base can also be "/"
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            { ssr: false, pure: true, displayName: true, fileName: true },
          ],
        ],
      },
    }),
    viteTsconfigPaths(),
    macrosPlugin(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],
});
