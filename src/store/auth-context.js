import React, { useState } from "react"

const AuthContext=React.createContext({
    isLoggedIn:false,
    token:'',
    setToken:()=>{}

})

export const AuthProvider=(props)=>{
    const [token,setToken]=useState(localStorage.getItem('mailToken'))
    const [emailId,setEmailId]=useState(localStorage.getItem('mailUserId'))

    const userIsLoggedIn=!!token;

    const handleSetToken=(token)=>{
        setToken(token)
        localStorage.setItem("mailToken",token)
        
    }
    const handleSetEmailID=(id)=>{
        setEmailId(id)
        localStorage.setItem("mailUserId",id)
    }
    const handleLogout=()=>{
        setToken(null)
        setEmailId(null)
        localStorage.setItem("mailToken",null)
        localStorage.setItem("mailUserId",null)
    }

    const authcontext={
        token:token,
        emailId:emailId,
        isLoggedIn:userIsLoggedIn,
        setToken:handleSetToken,
        setEmailId:handleSetEmailID,
        logout:handleLogout,
    }

    return <AuthContext.Provider value={authcontext}>{props.children}</AuthContext.Provider>

}


export default AuthContext;
