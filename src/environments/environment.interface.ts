import { locales } from '@environment/locales/en';

export interface Environment {
  production: boolean;
  locales: typeof locales;
}
