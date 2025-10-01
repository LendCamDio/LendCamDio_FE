import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  let errorStatus = 500;
  let errorMessage = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage =
      error.statusText || error.data?.message || "An error occurred";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const getErrorTitle = (status: number) => {
    switch (status) {
      case 404:
        return "Page Not Found";
      case 403:
        return "Access Forbidden";
      case 500:
        return "Internal Server Error";
      default:
        return "Error";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* <div className="sticky top-0 z-10">
        <Navbar />
      </div> */}

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-50">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
          {errorStatus}
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4 text-center">
          {getErrorTitle(errorStatus)}
        </h2>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          {errorMessage}
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default ErrorPage;
