import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-[color:var(--color-surface)]">
      {/* Left (Branding / Banner) */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-hero text-white p-12">
        <Link to="/" className="flex items-center space-x-3 mb-8">
          <img src="/vite.svg" alt="LendCamDio Logo" className="h-12 w-12" />
          <span className="font-display text-3xl font-bold">LendCamDio</span>
        </Link>
        <h2 className="text-4xl font-display font-bold mb-4">
          Capture Your Vision
        </h2>
        <p className="text-lg text-white/80 max-w-md text-center leading-relaxed">
          Join our platform to rent cameras, book studios and bring your
          creativity to life.
        </p>
      </div>

      {/* Right (Auth Form Wrapper) */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-[color:var(--color-background)]">
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-[color:var(--color-background)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
