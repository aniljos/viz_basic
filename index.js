import { i18n } from '@kbn/i18n';

import exampleRoute from './server/routes/example';
import fetchDataRoute from './server/routes/fetchData';

export default function(kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'viz_basic',
    uiExports: {
      app: {
        title: 'Viz Basic',
        description: 'Basic Visualization',
        main: 'plugins/viz_basic/app',
      },
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    // eslint-disable-next-line no-unused-vars
    init(server, options) {
      const xpackMainPlugin = server.plugins.xpack_main;
      if (xpackMainPlugin) {
        const featureId = 'viz_basic';

        xpackMainPlugin.registerFeature({
          id: featureId,
          name: i18n.translate('vizBasic.featureRegistry.featureName', {
            defaultMessage: 'viz_basic',
          }),
          navLinkId: featureId,
          icon: 'questionInCircle',
          app: [featureId, 'kibana'],
          catalogue: [],
          privileges: {
            all: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
            read: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
          },
        });
      }

      // Add server routes and initialize the plugin here
      exampleRoute(server);
      fetchDataRoute(server);
    },
  });
}
