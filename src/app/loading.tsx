import LoadingBar from '@/components/LoadingBar';

export default function Loading() {
  return (
    <main aria-busy="true">
      <LoadingBar />
      <span className="visually-hidden">Loading products…</span>
    </main>
  );
}
