import React, { useRef, useContext } from 'react';
import { ThemeWrap } from '@choerodon/boot';
import { observer } from 'mobx-react-lite';
import store, { StoreProvider } from './stores';
import ListView from './ListView';
import map from './themeMap';

export default observer((props) => {
  const cRef = useRef({});

  return (
    <StoreProvider {...props}>
      <ThemeWrap map={map(cRef)}>
        <ListView cRef={cRef} />
      </ThemeWrap>
    </StoreProvider>
  );
});
