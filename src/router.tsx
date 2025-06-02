import { createBrowserRouter } from 'react-router-dom'
import StaffLayout from '@/layouts/StaffLayout' // Main layout for staff pages
import LoginPage from '@/pages/Login' // Login page
import { SignedOut, RedirectToSignIn, SignedIn } from "@clerk/clerk-react"
import BloodStock from '@/pages/staff/dashboard/BloodStock'
import EmergencyRequest from './pages/staff/EmergencyRequest'
import Donation from './pages/staff/Donation'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
          <StaffLayout />
        {/* <SignedOut>
          <RedirectToSignIn />
        </SignedOut> */}
      </>
    ),
    children: [
      {
        index: true,
        element: <EmergencyRequest />
      },
      {
        path: 'bloodstock',
        element: <BloodStock />
      },
      {
        path: 'donation',
        element: <Donation />
      },
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
])