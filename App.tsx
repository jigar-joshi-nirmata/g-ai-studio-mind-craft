
import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import TestBuilderPage from './pages/TestBuilderPage';
import TestRunnerPage from './pages/TestRunnerPage';
import Profile from './pages/Profile';
import Library from './pages/Library';
import Settings from './pages/Settings';
import { AppContextProvider } from './context/AppContext';

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="learn" element={<Learn />} />
            <Route path="test-builder" element={<TestBuilderPage />} />
            <Route path="test-runner/:testId" element={<TestRunnerPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="library" element={<Library />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppContextProvider>
  );
};

export default App;
