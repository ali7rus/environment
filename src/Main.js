import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { useDispatch, } from "react-redux";
import { useEffect, } from "react";
import { subscribeToUsersLikes } from "./store/likes-slice";


function Main() {

  const dispatchAction = useDispatch();
  useEffect(() => {
    const unsubscribe = dispatchAction(subscribeToUsersLikes());
    
    return () => {
      unsubscribe();
    };
  },[]);

 

  // useEffect(() => {
  //   dispatchAction(userAction.setSessionStart(Date.now()));
  // }, [dispatchAction]);
  return (
    <Auth0Provider
      domain="dev-fvtkwdlf3s8g3fl4.us.auth0.com"
      clientId="njPH0AT84KFRZ6J22AAyMPV5L0dqAH4M"
      authorizationParams={{redirect_uri:"http://localhost:3000/api/auth/callback"
    }}> 
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  );
}

export default Main;
