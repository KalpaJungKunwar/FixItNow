import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams) => ({
  upload: {
    config: {
      responsiveDimensions: false,
      sizeOptimization: false,
      autoOrientation: false,
      security: {
        strictSizeCheck: false,
      },
      providerOptions: {
        localServer: {},
      },
    },
  },
});

export default config;