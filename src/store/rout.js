import { useAuth0 } from "@auth0/auth0-react";

const hasLocalToken = () => {
  return Boolean(localStorage.getItem("token"));
};


const ProtectedPageWrapper = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const token = hasLocalToken();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated && !token) {
    if (window.location.pathname !== "/local-login") {
      loginWithRedirect();
    }
    return null;
  }

  return <>{children}</>;
};
  
export default ProtectedPageWrapper;