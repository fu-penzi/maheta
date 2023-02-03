import { CapacitorConfig } from '@capacitor/cli';

// insert your ip here
// const hostIp = '192.168.0.104';

const config: CapacitorConfig = {
  appId: 'com.fupenzi.maheta',
  appName: 'Maheta',
  webDir: 'dist/maheta',
  bundledWebRuntime: false,
  loggingBehavior: 'none',
  // server: {
  //   url: `http://${hostIp}:8100`,
  //   cleartext: true,
  // },
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
