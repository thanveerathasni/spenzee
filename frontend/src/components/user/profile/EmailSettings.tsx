import { useState } from "react";

export default function EmailSettings() {
  const [email, setEmail] = useState("");

  return (
    <div>
      <h2 className="text-3xl font-serif">Email Settings</h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
}