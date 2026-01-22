import { authRepository } from "../../repositories/authRepository";
import { clearTokens } from "../../util/tokenStorage";

const TestAuth = () => {
  console.log("TestAuth rendered");

  const loginTest = async () => {
    alert("loginTest started");

    const res = await authRepository.login({
      email: "check@mail.com",
      password: "123456",
    });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Login done. Tokens saved.");
  };

  const profileTest = async () => {
    const res = await authRepository.profile();
    alert(JSON.stringify(res.data));
  };

  const breakAccessToken = () => {
    localStorage.setItem("accessToken", "abc.def.ghi");
    alert("Access token broken");
  };

  const removeRefreshToken = () => {
    localStorage.removeItem("refreshToken");
    alert("Refresh token removed");
  };

  const clearAll = () => {
    clearTokens();
    alert("All tokens cleared");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Auth System Test Panel</h2>

      <button onClick={loginTest}>1) Login & Save Tokens</button>
      <br /><br />

      <button onClick={profileTest}>2) Call Protected API</button>
      <br /><br />

      <button onClick={breakAccessToken}>3) Break Access Token</button>
      <br /><br />

      <button onClick={profileTest}>4) Call API (Auto Refresh)</button>
      <br /><br />

      <button onClick={removeRefreshToken}>5) Remove Refresh Token</button>
      <br /><br />

      <button onClick={profileTest}>6) Call API (Should Logout)</button>
      <br /><br />

      <button onClick={clearAll}>Clear All</button>
    </div>
  );
};

export default TestAuth;
