import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import App from './App';

function Root() {
  const Component = App?.default || App;
  return <Component />;
}

AppRegistry.registerComponent('main', () => Root);

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    AppRegistry.runApplication('main', { rootTag });
  }
}
