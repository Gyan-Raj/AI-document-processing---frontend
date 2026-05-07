export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/30 border-t-white" />
    </div>
  );
}
