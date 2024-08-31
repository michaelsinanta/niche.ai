import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/components/context/AuthContext";

const AuthGuard = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const { user } = UserAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/");
      }
    }, [user, router]);

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default AuthGuard;
