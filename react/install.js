import { set } from '@choerodon/inject';

set('base:transferModal', () => import('./components/transferModal'));
set('base:userInfoContent', () => import('./routes/user/user-info'));
