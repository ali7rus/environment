import { useAuth0 } from "@auth0/auth0-react";


const ProtectedPageWrapper = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return <>{children}</>;
};
  
export default ProtectedPageWrapper;