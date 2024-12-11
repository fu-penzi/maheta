import { CapacitorConfig } from '@capacitor/cli';

import * as process from 'node:process';

// insert your ip here
const hostIp = '192.168.0.107';

const config: CapacitorConfig = {
  appId: 'com.fupenzi.maheta',
  appName: 'Maheta',
  webDir: 'dist/maheta',
  ...(process.env['NODE_ENV']?.toString().startsWith('production')
    ? {}
    : {
        server: {
          url: `http://${hostIp}:8100`,
          cleartext: true,
        },
      }),
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: true,
      androidSpinnerStyle: 'horizontal',
      spinnerColor: '#501E68',
    },
  },
};

export default config;
