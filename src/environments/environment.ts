import { EnvironmentConfig, mqttDefaults } from './environment-type';

export const environment: EnvironmentConfig = {
  appVersion: 'dev',
  production: false,
  env: 'dev',

  mqttConfigOptions: {
    ...mqttDefaults,
    hostname: 'localhost',
    username: 'user',
    password: 'password',
  },
};
