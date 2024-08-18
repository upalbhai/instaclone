import './App.css';
import SignUp from './components/SignUp';
import Login from './components/Login';
// import Home from './components/Home'; // Assuming you have a Home component
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Posts from './components/Posts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children:[{
      path:'/',
      element:<Home />
    },{
      path:'/posts',
      element:<Posts/>
    }
  ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);

function App() {
  return (
    <div className="">
      <RouterProvider router={router} />
      <Toaster
  toastOptions={{
    success: {
      style: {
        border: '1px solid #34C759', // Bright green border for success
        padding: '16px',
        color: '#2E865F', // Dark green text for success
        backgroundColor: '#F7FDF4', // Light green background for success
        borderRadius: '4px', // Add a subtle border radius
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
      },
    },
    error: {
      style: {
        border: '1px solid #E74C3C', // Deep red border for error
        padding: '16px',
        color: '#B03A3A', // Dark red text for error
        backgroundColor: '#FFD7BE', // Soft orange background for error
        borderRadius: '4px', // Add a subtle border radius
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
      },
    },
  }}
/>
    </div>
  );
}

export default App;
