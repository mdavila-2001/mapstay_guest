import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationProvider } from './src/components/NotificationProvider';
import TestComponents from './src/screens/TestComponents';

function Root() {
  return React.createElement(
    SafeAreaProvider,
    null,
    React.createElement(
      NotificationProvider,
      null,
      React.createElement(TestComponents, null)
    )
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Root);
