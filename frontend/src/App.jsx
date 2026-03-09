import { Routes, Route, Navigate } from 'react-router-dom';
import LoginSelectionPage from './LoginSelectionPage';
import StudentLoginPage from './pages/StudentLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ChatPage from './pages/ChatPage';
import AIKnowledgeBasePage from './pages/AIKnowledgeBasePage';

// SIS Components
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/admin/Overview';
import StudentManagement from './pages/admin/StudentManagement';
import Academics from './pages/admin/Academics';
import Timetable from './pages/admin/Timetable';
import Attendance from './pages/admin/Attendance';
import Exams from './pages/admin/Exams';
import Fees from './pages/admin/Fees';
import Notices from './pages/admin/Notices';
import BulkImport from './pages/admin/BulkImport';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
      <Route path="/" element={<LoginSelectionPage />} />
      <Route path="/student-login" element={<StudentLoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      
      {/* SIS Admin Dashboard */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="academics" element={<Academics />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="exams" element={<Exams />} />
        <Route path="fees" element={<Fees />} />
        <Route path="notices" element={<Notices />} />
        <Route path="import" element={<BulkImport />} />
      </Route>
      
      <Route path="/admin-dashboard" element={<Navigate to="/admin/overview" replace />} />
      
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/ai-knowledge-base" element={<AIKnowledgeBasePage />} />
    </Routes>
    </ErrorBoundary>
  );
}

export default App;
