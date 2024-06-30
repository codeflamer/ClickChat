import Nav from "@/components/nav-top";
import SideBar from "@/components/side-bar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, SquareChevronRight } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="flex bg-slate-50 md:space-x-2">
        <section className="border-r border-black shadow-lg">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <SquareChevronRight className="mt-3" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[350px] p-0">
                <SideBar />
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:block">
            <SideBar />
          </div>
        </section>
        <div className="flex-1 flex-grow">{children}</div>
      </section>
    </>
  );
}
