import { createBrowserRouter } from 'react-router-dom'
import StaffLayout from '@/layouts/StaffLayout' // Main layout for staff pages
import LoginPage from '@/pages/Login' // Login page
import { SignedOut, RedirectToSignIn, SignedIn } from "@clerk/clerk-react"
import BloodStock from '@/pages/staff/dashboard/BloodStock'
import EmergencyRequest from './pages/staff/EmergencyRequest'
import Donation from './pages/staff/Donation'
import CampaignList from './pages/staff/CampaignList'
import StaffProfile from './pages/staff/StaffProfile'
import DonorRegister from './pages/staff/DonorRegister'
import RecipientRegister from './pages/staff/RecipientRegister'
import BlogList from './pages/staff/BlogList'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <SignedIn>
          <StaffLayout />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
    children: [
      {
        index: true,
        element: <EmergencyRequest />
      },
      {
        path: 'campaign',
        element: <CampaignList/>
      },
      {
        path: 'bloodstock',
        element: <BloodStock />
      },
      {
        path: 'donation',
        element: <Donation />
      },
      {
        path: 'donorregister',
        element: <DonorRegister />
      },
      {
        path: 'recipientRegister',
        element: <RecipientRegister />
      },
      {
        path: 'bloglist',
        element: <BlogList />
      },
      {
        path: 'staffprofile',
        element: <StaffProfile />
      },
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
])