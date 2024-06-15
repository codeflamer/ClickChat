import Nav from "@/components/nav-top";
import { Separator } from "@/components/ui/separator";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-screen-2xl px-5 md:px-20">
        <Nav />
        {children}
      </section>
    </section>
  );
}
