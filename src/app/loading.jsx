export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C9A227]/30 border-t-[#C9A227]" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}