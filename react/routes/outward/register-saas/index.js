import React from 'react';
import { inject } from 'mobx-react';
import Content from './Content';

export default inject('AppState')((props) => <Content {...props} />);
