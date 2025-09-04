import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppToaster from './components/ui/toaster'

const LoginPage = lazy(() => import('./pages/Login'))
const DashboardPage = lazy(() => import('./pages/Dashboard'))
const DotationsPage = lazy(() => import('./pages/Dotations'))
const EnterprisesPage = lazy(() => import('./pages/Enterprises'))
const DocumentsPage = lazy(() => import('./pages/Documents'))
const ArchivesPage = lazy(() => import('./pages/Archives'))
const TaxPage = lazy(() => import('./pages/Tax'))
const BlanchimentPage = lazy(() => import('./pages/Blanchiment'))
const StaffConfigPage = lazy(() => import('./pages/StaffConfig'))
const CompanyConfigPage = lazy(() => import('./pages/CompanyConfig'))
const SuperadminPage = lazy(() => import('./pages/Superadmin'))

export default function App() {
  return (
    <AppProvider>
      <Suspense fallback={<div>Chargement…</div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dotations" element={<DotationsPage />} />
          <Route path="/entreprises" element={<EnterprisesPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/archives" element={<ArchivesPage />} />
          <Route path="/impots" element={<TaxPage />} />
          <Route path="/blanchiment" element={<BlanchimentPage />} />
          <Route path="/staff-config" element={<StaffConfigPage />} />
          <Route path="/company-config" element={<CompanyConfigPage />} />
          <Route path="/superadmin" element={<SuperadminPage />} />
        </Routes>
      </Suspense>
      <AppToaster />
    </AppProvider>
  )
}
