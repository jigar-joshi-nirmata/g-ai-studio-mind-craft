import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import TestBuilderPage from './pages/TestBuilderPage';
import TestRunnerPage from './pages/TestRunnerPage';
import Profile from './pages/Profile';
import { AppContextProvider } from './context/AppContext';
import GradingPage from './pages/GradingPage';
import TestResultPage from './pages/TestResultPage';

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
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* Routes outside MainLayout for fullscreen experience */}
          <Route path="test-runner/:testId" element={<TestRunnerPage />} />
          <Route path="grading/:testId" element={<GradingPage />} />
          <Route path="results/:testId" element={<TestResultPage />} />
        </Routes>
      </HashRouter>
    </AppContextProvider>
  );
};

export default App;