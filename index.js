import { registerRootComponent } from 'expo';
import React from 'react';
import App from './App';
import { NameProvider } from './src/context/NameContext'; // Import the correct provider

const RootApp = () => {
  return (
    <NameProvider>
      <App />
      </NameProvider>
  );
};

registerRootComponent(RootApp);
