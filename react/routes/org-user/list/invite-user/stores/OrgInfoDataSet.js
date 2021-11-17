import { organizationsApiConfig } from '@/api';

export default ({ id = 0, organizationId }) => ({
  autoQuery: false,
  selection: 'single',
  paging: false,
  transport: {
    read: {
      ...organizationsApiConfig.emailSuffix(),
      transformResponse: (res) => {
        if (res) {
          return {
            emailSuffix: res,
          };
        }
        return {};
      },
    },
  },
});
