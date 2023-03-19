import { useEffect } from "react";
import { useRouter } from "next/router";
import { checkIfLoggedIn, goMainPage } from '../utils/utils';

const Login = () => {
  const router = useRouter();
  useEffect(() => {
    const isLoggedIn = async () => {
      const loggedIn = await checkIfLoggedIn(router);
      if (loggedIn) {
        goMainPage(router);
      }
    };
    isLoggedIn();
  }, []);

  const handleLogin = async () => {
    const url = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_API_UID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&response_type=code`;
    window.location.assign(url);
  };

  return (
    <div>
      <h1>배공파</h1>
      <img src="https://t1.daumcdn.net/cfile/tistory/99C9493C5F32979520" width='300'></img>
      <br></br>
      <button onClick={handleLogin}>Login button</button>
    </div>
  );
};

export default Login;
