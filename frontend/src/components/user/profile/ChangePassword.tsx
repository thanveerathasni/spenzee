import { useState } from "react";

export default function ChangePassword() {
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2 className="text-3xl font-serif">Change Password</h2>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
}