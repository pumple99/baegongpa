import { useRouter, NextRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios, { formToJSON } from 'axios';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { nicknameState } from '../components/atom';

const MAIN_PAGE = "/";

// async function getToken(code: string) {
//   const { data } = await axios.post('https://api.intra.42.fr/oauth/token', {
//     grant_type: 'authorization_code',
//     client_id: process.env.NEXT_PUBLIC_API_UID,
//     client_secret: process.env.NEXT_PUBLIC_API_SECRET,
//     code: code,
//     redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
//   });
//   return data;
// }

export async function checkIfLoggedIn(router: NextRouter): Promise<boolean> {
  const token = Cookies.get('accessToken');

  if (token) {
    try {
      const response = await axios.get(
        "v2/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 400) {
        throw new Error("Not Authorized");
      }
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
}

export function logOut(router: NextRouter) {
  Cookies.set('accessToken', '', { expires: 0} );
  router.push('/login');
}

export function goMainPage(router: NextRouter) {
  router.push(MAIN_PAGE);
}

export const getNicknameFromToken = async () => {
  const accessToken = Cookies.get('accessToken');
  try {
    const response = await axios.get("v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.login;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export function getNickname() {
  const [nickname, setNickname] = useRecoilState(nicknameState);
  useEffect(()=>{
    getNicknameFromToken().then((nickname) => {
      setNickname(nickname);
     })
  },[])

  return nickname;
}