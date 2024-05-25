import SideBar from "@/components/side-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex md:space-x-2">
      <div className=" hidden md:block">
        <SideBar />
      </div>
      <div className="flex-1 flex-grow">{children}</div>
    </section>
  );
}
