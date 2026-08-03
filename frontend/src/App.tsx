import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskBoard from './pages/TaskBoard';
import ComponentShowcase from './pages/ComponentShowcase';
import Logbook from './pages/Logbook';
import History from './pages/History';
import ActivityFeed from './pages/ActivityFeed';
import KnowledgeBase from './pages/KnowledgeBase';
import SopManagement from './pages/SopManagement';
import Evaluation from './pages/Evaluation';
import ReportExport from './pages/ReportExport';

// Competency Modul
import CompetencyOverview from './pages/competency/Overview';
import CompetencySkillMatrix from './pages/competency/SkillMatrix';
import CompetencyLearningPath from './pages/competency/LearningPath';
import CompetencyPractice from './pages/competency/Practice';
import PracticeSession from './pages/competency/PracticeSession';
import PracticeResult from './pages/competency/PracticeResult';
import PreTestWelcome from './pages/competency/PreTestWelcome';
import PreTestSession from './pages/competency/PreTestSession';
import PreTestResult from './pages/competency/PreTestResult';

import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner message="Menyiapkan ruang kerja Anda..." /></div>;
    if (!user) return <Navigate to="/login" replace />;
    
    // Redirect intern to pre-test if they haven't completed it, but allow them to actually visit the pre-test pages
    const isPreTestRoute = window.location.pathname.startsWith('/competency/pre-test');
    if (user.role === 'intern' && !user.has_completed_pre_test && !isPreTestRoute) {
        return <Navigate to="/competency/pre-test/welcome" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<TaskBoard />} />
            <Route path="logbook" element={<Logbook />} />
            <Route path="activity" element={<ActivityFeed />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="sop-management" element={<SopManagement />} />
            <Route path="evaluations" element={<Evaluation />} />
            <Route path="reports/:id" element={<ReportExport />} />
            <Route path="history" element={<History />} />
            <Route path="ui-kit" element={<ComponentShowcase />} />
            
            <Route path="competency">
                <Route index element={<CompetencyOverview />} />
                <Route path="skill-matrix" element={<CompetencySkillMatrix />} />
                <Route path="learning-path" element={<CompetencyLearningPath />} />
                <Route path="practice" element={<CompetencyPractice />} />
                <Route path="practice/session" element={<PracticeSession />} />
                <Route path="practice/result" element={<PracticeResult />} />
                <Route path="pre-test">
                    <Route path="welcome" element={<PreTestWelcome />} />
                    <Route path="session" element={<PreTestSession />} />
                    <Route path="result" element={<PreTestResult />} />
                </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
