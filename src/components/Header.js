import { Link, useNavigate } from "react-router-dom";
import classes from "./Header.module.css"
import { useContext } from "react";
import AuthContext from "../store/auth-context";

const Header=()=>{

    const authCntx=useContext(AuthContext)

    console.log(authCntx)
    
    const navi=useNavigate();
    

    const handleLogout=()=>{
        authCntx.logout();
        navi('/')
    }
   
    return(
        <header className={classes.header}>
            <div >
            <Link className={classes.link} to="/" >Home</Link>
            <Link className={classes.link} to="/compose" >Compose</Link>
            <Link className={classes.link} to="/inbox" >Inbox</Link>
            <Link className={classes.link} to="/sent" >Sent</Link>
            </div>
            <div>{localStorage.getItem('mailUserId')}
            <button className={classes.button} onClick={handleLogout}>Log Out</button>
            </div>
            
            
        </header>
    )
}

export default Header;