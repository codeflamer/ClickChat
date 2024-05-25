import Nav from "@/components/bread-crumb";
import { Separator } from "@/components/ui/separator";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Nav />
      <Separator />
      {children}
    </section>
  );
}
