import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './assets/components/layout/Layout';
import Dashboard from './assets/pages/DashboardTable';
import ComparisonPage from './assets/pages/ComparisonPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/comparison" element={<ComparisonPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}