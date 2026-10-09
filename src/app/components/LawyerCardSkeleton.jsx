export default function LawyerCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col items-center rounded-2xl border border-gray-200 bg-white p-5">
      <div className="h-24 w-24 rounded-full bg-gray-200" />
      <div className="mt-4 h-4 w-32 rounded bg-gray-200" />
      <div className="mt-3 h-5 w-20 rounded-full bg-gray-200" />
      <div className="mt-5 h-5 w-24 rounded bg-gray-200" />
    </div>
  );
}