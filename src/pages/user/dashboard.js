import { signOut } from "next-auth/react";

export default function Dashboard() {
  return (
    <div className="mt-64 mb-64">
      <button onClick={() => signOut("user-login")}>sign out</button>
    </div>
  );
}
