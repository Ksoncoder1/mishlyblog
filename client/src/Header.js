import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header (){
  //const [userName, setUsername] = useState(null);
  const {setUserInfo, userInfo} = useContext(UserContext)
  const baseURL = process.env.REACT_API_BASE_URL;
  useEffect(() =>{
    fetch(`${baseURL}/profile`, {
    //fetch(`${url}/profile`, {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo =>{
        //setUsername(userInfo.userName);
        setUserInfo(userInfo)

      })
    })
  }, [])

  function logout() {
    fetch(`${baseURL}/logout`, {
    //fetch(`${url}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    //setUsername(null )
    setUserInfo(null);
  }
  const userName = userInfo?.userName;
    return (
        <header>
          <Link to="/" className='logo myblog' >TechBlogs</Link>
          <nav>
            {userName && (
              <div className="header-stuffs">
                <span className="hello-user">Hello, {userName}</span>
                <Link className="general-btn" to='/create'>Create New Post</Link>
                <a className="general-btn" href="" onClick={logout}>Logout</a>
              </div>
            )}
            {!userName && (
              <div className="header-stuffs">
                <Link></Link>
                <Link className="general-btn" to="/login">Login</Link>
                <Link className="general-btn" to="/register">Register</Link>
              </div>
            )}
            
          </nav>
       </header>
    )
}
