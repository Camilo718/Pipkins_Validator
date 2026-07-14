import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-[1700px] p-8">
        {children}
      </main>
    </div>
  );
}