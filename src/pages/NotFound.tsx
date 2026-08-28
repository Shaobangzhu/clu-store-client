import React from "react";

interface NotFoundProps {
  onGoHome?: () => void;
  onGoBack?: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onGoHome, onGoBack }) => {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
      return;
    }

    window.location.href = "/";
  };

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
      return;
    }

    window.history.back();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      {/* Background glow */}
      <div className="absolute left-[15%] top-[20%] h-72 w-72 rounded-full bg-violet-500/20 blur-[120px]" />
      <div className="absolute bottom-[15%] right-[15%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 w-full max-w-3xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
          PAGE NOT FOUND
        </div>

        {/* 404 */}
        <div className="relative">
          <h1 className="select-none bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-[120px] font-black leading-none tracking-[-0.08em] text-transparent sm:text-[180px]">
            404
          </h1>

          <div className="absolute inset-0 -z-10 scale-110 bg-violet-500/10 blur-3xl" />
        </div>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-4xl">
          Looks like you're lost.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          The page you're trying to reach may have been moved, deleted, or never
          existed in the first place.
        </p>

        {/* Decorative route */}
        <div className="mx-auto my-8 flex max-w-sm items-center justify-center">
          <div className="h-3 w-3 rounded-full border-2 border-indigo-400 bg-slate-950" />

          <div className="mx-2 h-px flex-1 bg-gradient-to-r from-indigo-400/70 via-violet-400/30 to-slate-700" />

          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 text-slate-400"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3m0 4h.01M5.07 19h13.86a2 2 0 0 0 1.73-3L13.73 4a2 2 0 0 0-3.46 0L3.34 16a2 2 0 0 0 1.73 3Z"
              />
            </svg>
          </div>

          <div className="mx-2 h-px flex-1 bg-gradient-to-r from-slate-700 via-cyan-400/30 to-cyan-400/70" />

          <div className="h-3 w-3 rounded-full border-2 border-cyan-400 bg-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleGoHome}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow-indigo-500/30 active:translate-y-0"
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
                d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6"
              />
            </svg>
            Go Home
          </button>

          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 active:translate-y-0"
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
                d="m15 18-6-6 6-6"
              />
            </svg>
            Go Back
          </button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
