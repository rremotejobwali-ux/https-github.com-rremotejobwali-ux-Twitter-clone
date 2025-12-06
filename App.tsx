import React from 'react';
import { AppProvider, useAppStore } from './store';
import { Layout } from './components/Layout';
import { Feed } from './components/Feed';
import { Profile } from './components/Profile';

const AppContent = () => {
  const { view } = useAppStore();

  return (
    <Layout>
      {view === 'HOME' && <Feed />}
      {view === 'PROFILE' && <Profile />}
    </Layout>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;