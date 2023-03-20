import { useEffect } from "react";
import { useRouter } from "next/router";
import { checkIfLoggedIn, goMainPage } from '../utils/utils';
import {Button, Space } from 'antd';
import Image from 'next/image';
import ExImage from '/public/img/baegongpa_logo.png';

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
    <div style={{backgroundColor: '#ffd1aa'}}>
      <Image src={ExImage}
        alt='logo'
        style={{  
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          width: "50%",
          height: "50%"}}
      />
      <h1 style={{textAlign : "center"}}>42_<span style={{color: "#FF601A"}}>배</span>달 <span style={{color: "#FF601A"}}>공</span>유 <span style={{color: "#FF601A"}}>파</span>티</h1>
      <h2 style={{textAlign : "center"}}>안녕하세요! 저희는 개포 클러스터에서 배달을 같이 시킬 사람을 구할 수 있는 42_배공파 서비스를 만들었습니다.</h2>
      <Space direction="horizontal" align="center" style={{width: "100%", paddingLeft: "40%"}} >
        <Button size="large" type="primary" onClick={handleLogin}>Sign in with 42</Button>
      </Space>
      
    </div>
  );
};

export default Login;
