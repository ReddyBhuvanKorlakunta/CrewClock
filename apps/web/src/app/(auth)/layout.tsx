export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="mb-8 text-center">
        <span className="text-2xl font-bold text-primary">CrewClock</span>
        <p className="mt-1 text-sm text-muted-foreground">AI-powered workforce management</p>
      </div>
      {children}
    </div>
  );
}
