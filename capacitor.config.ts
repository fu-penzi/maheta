import { CapacitorConfig } from '@capacitor/cli';

import * as process from 'node:process';

// insert your ip here
const hostIp = '192.168.0.107';

const config: CapacitorConfig = {
  appId: 'com.fupenzi.maheta',
  appName: 'Maheta',
  webDir: 'dist/maheta',
  android: {
    buildOptions: {
      signingType: 'apksigner',
    },
  },
  ...(process.env['NODE_ENV']?.toString().startsWith('local')
    ? {
        server: {
          url: `http://${hostIp}:8100`,
          cleartext: true,
        },
      }
    : { loggingBehavior: 'production' }),
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

if (process.env['NODE_ENV']?.toString().startsWith('local')) {
  config.backgroundColor = '#FF0000FF';
  config.plugins = {};
}

export default config;
