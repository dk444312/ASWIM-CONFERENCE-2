/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { AbstractSubmissionPage } from './pages/AbstractSubmissionPage';
import { SubthemesPage } from './pages/SubthemesPage';
import { RegistrationDashboard } from './registration/RegistrationDashboard';
import { RegistrationLoginPage } from './registration/RegistrationLoginPage';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminDashboard } from './admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/subthemes" element={<SubthemesPage />} />
        <Route path="/abstract-submission" element={<AbstractSubmissionPage />} />
        <Route path="/login" element={<RegistrationLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/registration/*" element={<RegistrationDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
