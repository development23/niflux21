import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Vendor() {
  const session = useSession();
  useEffect(() => {
    // console.log(session);
  }, [session]);
  return (
    <div className="py-80">
      <button onClick={() => signOut("vendor-login")}>Sign Out</button>
      <br />
      {session?.data?.name}
      <br />
      {session?.data?.email}
    </div>
  );
}
