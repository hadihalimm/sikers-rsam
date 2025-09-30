import { HomeSidebar } from '@/components/sidebar/home-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <HomeSidebar />
        <main className="w-full rounded-lg px-4 py-2 border m-2">
          <div className="flex gap-x-2 items-center h-[35px] border-b mb-4 py-1">
            <SidebarTrigger />
            <Separator orientation="vertical" className="min-h-full" />
          </div>
          {children}
        </main>
      </div>
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
