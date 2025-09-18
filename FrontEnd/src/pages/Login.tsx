import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { loginWithGoogle, loginWithEmail } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (credentialResponse.credential) {
      try {
        const data = await loginWithGoogle(credentialResponse.credential);
        localStorage.setItem("token", data.token);
        navigate("/");
      } catch (err) {
        console.error("Google login failed:", err);
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const password = (
      e.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;

    try {
      const data = await loginWithEmail(email, password);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      console.error("Email login failed:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[color:var(--color-text-primary)] mb-6 text-center">
        Login to LendCamDio
      </h1>

      {/* Google Login */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log("Login Failed")}
      />

      <p className="mt-4 text-sm text-center text-[color:var(--color-text-secondary)]">
        Or login with your account
      </p>

      {/* Email Login */}
      <form className="mt-4 space-y-4" onSubmit={handleEmailLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border border-[color:var(--color-border)] rounded-md p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-[color:var(--color-border)] rounded-md p-2"
        />
        <button type="submit" className="btn-primary w-full">
          Login
        </button>
      </form>

      {/* Link to Register */}
      <p className="mt-4 text-sm text-center text-[color:var(--color-text-secondary)]">
        Don’t have an account?{" "}
        <Link
          to="/auth/register"
          className="text-[color:var(--color-accent)] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
