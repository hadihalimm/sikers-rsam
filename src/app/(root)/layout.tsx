'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { HomeSidebar } from '@/components/ui/home-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useBreadcrumbStore } from '@/hooks/use-breadcrumb';
import { SlashIcon } from 'lucide-react';

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { breadcrumb } = useBreadcrumbStore();

  return (
    <SidebarProvider>
      <HomeSidebar />
      <main className="rounded-lg px-4 py-2 border m-2 w-full">
        <div className="flex gap-x-2 items-center h-[35px] border-b mb-4 py-1">
          <SidebarTrigger />
          <Separator orientation="vertical" className="min-h-full" />

          <Breadcrumb className="ml-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumb.map((bc) => (
                <>
                  <BreadcrumbSeparator>
                    <SlashIcon />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem key={bc.url}>{bc.title}</BreadcrumbItem>
                </>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
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
