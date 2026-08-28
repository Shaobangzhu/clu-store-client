import React from "react";

interface ErrorPageProps {
  statusCode?: number | string;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 404,
  title = "Something went wrong",
  message = "The page you're looking for doesn't exist, has moved, or is temporarily unavailable.",
  onRetry,
  onGoHome,
}) => {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
      return;
    }

    window.location.href = "/";
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      {/* Background glow */}
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Status code */}
        <div className="relative mb-4">
          <h1 className="select-none bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-[110px] font-black leading-none tracking-tight text-transparent sm:text-[150px]">
            {statusCode}
          </h1>

          <div className="absolute inset-0 -z-10 scale-110 bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl sm:p-10">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-indigo-300"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.3 3.7 2.8 17a2 2 0 0 0 1.74 3h14.92a2 2 0 0 0 1.74-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
            {message}
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGoHome}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:translate-y-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15 18-6-6 6-6"
                />
              </svg>
              Back Home
            </button>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 active:translate-y-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5m-5 4a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-600">
          If the problem continues, please contact support.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
