import { render, screen } from '@testing-library/react'
import { AppProvider } from '../../context/AppContext'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'
import DotationsPage from '../Dotations'
import EnterprisesPage from '../Enterprises'
import DocumentsPage from '../Documents'
import ArchivesPage from '../Archives'
import TaxPage from '../Tax'
import BlanchimentPage from '../Blanchiment'
import StaffConfigPage from '../StaffConfig'
import CompanyConfigPage from '../CompanyConfig'
import SuperadminPage from '../Superadmin'
import Login from '../Login'
import React from 'react'

const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <AppProvider>
    <MemoryRouter>{children}</MemoryRouter>
  </AppProvider>
)

type Case = { name: string; component: React.ReactElement; text: RegExp }

const cases: Case[] = [
  { name: 'Login', component: <Login />, text: /Connexion/ },
  { name: 'Dashboard', component: <Dashboard />, text: /Dashboard/ },
  { name: 'Dotations', component: <DotationsPage />, text: /Dotations/ },
  { name: 'Entreprises', component: <EnterprisesPage />, text: /Entreprises/ },
  { name: 'Documents', component: <DocumentsPage />, text: /Documents/ },
  { name: 'Archives', component: <ArchivesPage />, text: /Archives/ },
  { name: 'Tax', component: <TaxPage />, text: /Tranches fiscales/ },
  { name: 'Blanchiment', component: <BlanchimentPage />, text: /État/ },
  { name: 'StaffConfig', component: <StaffConfigPage />, text: /Paliers salariaux/ },
  { name: 'CompanyConfig', component: <CompanyConfigPage />, text: /Configuration Entreprise/ },
  { name: 'Superadmin', component: <SuperadminPage />, text: /Superadmin/ }
]

describe('pages render', () => {
  test.each(cases)('$name renders', async ({ component, text }) => {
    render(component, { wrapper })
    const els = await screen.findAllByText(text)
    expect(els[0]).toBeInTheDocument()
  })
})
