import { Header } from '@/components/layout/header';

export default function MyPageLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-10 w-48 bg-muted rounded-xl" />
            <div className="h-4 w-64 bg-muted rounded-lg" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 w-full bg-muted rounded-3xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
