import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import { lazy, Suspense } from 'react'
import {  createBrowserRouter } from "react-router-dom";
import AuthRoute from '@/components/AuthRoute'
const Publish = lazy(() => import('@/pages/Publish'))
const Article = lazy(() => import('@/pages/Article'))
const Home = lazy(() => import('@/pages/Home'))
const router=createBrowserRouter([{
  path: "/",
    element: <AuthRoute><Layout /></AuthRoute>,
    children: [
      {
        index: true,
        element: 
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>,
      },
      {
        path: 'article',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Article />
          </Suspense>
        ),
      },
      {
        path: 'publish',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Publish />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />
  }
])
export default router;