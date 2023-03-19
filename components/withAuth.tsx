import { useEffect } from "react";
import { useRouter } from "next/router";
import { checkIfLoggedIn } from "../utils/utils";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const isLoggedIn = async () => {
        const loggedIn = await checkIfLoggedIn(router);
        if (!loggedIn) {
          router.push("/login");
        }
      };

      isLoggedIn();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;