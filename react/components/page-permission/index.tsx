import React, { ComponentType } from 'react';
import { Spin } from 'choerodon-ui/pro';
import { Permission } from '@choerodon/boot';
import { NoAccess } from '@choerodon/master';
import { Size } from 'choerodon-ui/pro/lib/core/enum';

const defaultChildren = (
  <div style={{
    textAlign: 'center',
    paddingTop: 300,
  }}
  >
    <Spin size={'large' as Size} />
  </div>
);

// eslint-disable-next-line max-len
const PermissionHOC = (permissions: string[]) => (Component: ComponentType): React.FC => (props) => (
  <Permission
    service={permissions}
    defaultChildren={defaultChildren}
    noAccessChildren={<NoAccess />}
  >
    <Component {...props} />
  </Permission>
);
export default PermissionHOC;
