import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/Login' // Login page
import { SignedOut, RedirectToSignIn, SignedIn } from "@clerk/clerk-react"
import Dashboard from '@/pages/admin/dashboard/Dashboard'
import CampaignList from './pages/admin/CampaignList'
import UserList from './pages/admin/UserList'
import BloodStock from './pages/admin/BloodStock'
import AdminLayout from './layouts/AdminLayout'
import AdminProfile from './pages/admin/AdminProfile'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <SignedIn>
          <AdminLayout />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'campaign',
        element: <CampaignList/>
      },
      {
        path: 'userlist',
        element: <UserList/>
      },
      {
        path: 'bloodstock',
        element: <BloodStock />
      },
      {
        path: 'adminprofile',
        element: <AdminProfile />
      },   
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
])