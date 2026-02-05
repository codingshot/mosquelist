export function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      aria-label="Loading"
    >
      <div className="relative h-16 w-16">
        <img
          src="/favicon.ico"
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          width={64}
          height={64}
        />
        <div className="absolute inset-[-6px] rounded-full border-2 border-border border-t-primary animate-loading-spin" />
      </div>
    </div>
  );
}
