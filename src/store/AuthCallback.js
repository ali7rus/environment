import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const { handleRedirectCallback } = useAuth0();
    const navigate = useNavigate();
  
    useEffect(() => {
      const processAuthCallback = async () => {
        await handleRedirectCallback();
        // navigate('/'); 
        navigate('/protected'); // Перенаправить на защищенную страницу после успешной аутентификации
      };
  
      processAuthCallback();
    }, [handleRedirectCallback, navigate]);
  
    return <div>Обработка аутентификации, пожалуйста, подождите...</div>;
  };
  
  export default AuthCallback;