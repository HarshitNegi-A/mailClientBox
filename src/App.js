import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./components/SignUp";
import { useContext } from "react";
import AuthContext from "./store/auth-context";
import Home from "./components/Home";
import ComposeMail from "./components/ComposeMail";
import Inbox from "./components/Inbox";
import SentMail from "./components/SentMail";

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
    {
      path:'/inbox',
      element: <Inbox/>
    },
    {
      path:'/sent',
      element: <SentMail/>
    },
  ])
  return (
      <RouterProvider router={router} />
  );
}

export default App;
