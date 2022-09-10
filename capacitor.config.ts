import { CapacitorConfig } from '@capacitor/cli';

// insert your ip here
const hostIp = '192.168.0.106';

const config: CapacitorConfig = {
  appId: 'com.fupenzi.maheta',
  appName: 'Maheta',
  webDir: 'dist/maheta',
  bundledWebRuntime: false,
  server: {
    url: `http://${hostIp}:8100`,
    cleartext: true,
  },
};

export default config;
