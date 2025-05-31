import { createBrowserRouter } from 'react-router-dom'
import StaffLayout from '@/layouts/StaffLayout' // Main layout for staff pages
import StaffDashboard from '@/pages/staff/dashboard/page' // Example staff page
import LoginPage from '@/pages/Login' // Login page

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StaffLayout />,
    children: [
      {
        index: true,
        element: <StaffDashboard />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
]) 