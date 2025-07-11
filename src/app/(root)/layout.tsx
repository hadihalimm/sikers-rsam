import { HomeSidebar } from '@/components/ui/home-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <HomeSidebar />
      <main className="rounded-lg px-4 py-2 border m-2 w-full">
        <div className="flex gap-x-2 items-center h-[35px] border-b mb-4 py-1">
          <SidebarTrigger />
          <Separator orientation="vertical" className="min-h-full" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}

{
  /* <SidebarProvider className="bg-sidebar">
      <HomeSidebar />
      <main className="my-2 px-4 py-2 mx-2 w-full rounded-lg bg-background">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider> */
}
