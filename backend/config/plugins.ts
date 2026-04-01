import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams) => ({
  upload: {
    config: {
      providerOptions: {
        localServer: {},
      },
    },
  },
});

export default config;