import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/SignUp";
import { useContext } from "react";
import AuthContext from "./store/auth-context";
import Home from "./components/Home";
import ComposeMail from "./components/ComposeMail";

function App() {
  const authcntx=useContext(AuthContext)
  const router=createBrowserRouter([
    {
      path:'/',
      element: authcntx.isLoggedIn ? <Home/> : <SignUp/>
    },
    {
      path:'/compose',
      element: <ComposeMail/>
    },
  ])
  return (
      <RouterProvider router={router} />
  );
}

export default App;
