import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: 'http://localhost:3000/' } })}>
   <img src="https://img.icons8.com/windows/32/null/import.png" alt=""/>
    </button>
  );
};

export default LogoutButton;