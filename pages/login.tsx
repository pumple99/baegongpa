import { useEffect } from "react";
import { useRouter } from "next/router";
import { checkIfLoggedIn, goMainPage } from '../utils/utils';
import { Image, Button, Space } from 'antd';

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
      <Image style={{textAlign : "center"}}
        width={200}
        src="../imgs/main_logo.png"
      />
      <h1 style={{textAlign : "center"}}>42_<b>배</b>달 <b>공</b>유 <b>파</b>티</h1>
      <h2 style={{textAlign : "center"}}>안녕하세요! 저희는 개포 클러스터에서 배달을 같이 시킬 사람을 구할 수 있는 42_배공파 서비스를 만들었습니다.</h2>
      <Space wrap>
        <Button type="primary" onClick={handleLogin}>Sign in with 42</Button>
      </Space>
    </div>
  );
};

export default Login;
