'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

export const aplikasiGroup = [
  {
    title: 'Cascading',
    url: '/cascading',
  },
  {
    title: 'Renstra',
    url: '/renstra',
  },
  {
    title: 'Indikator Kinerja Utama',
    url: 'indikator-kinerja-utama',
  },
  {
    title: 'Rencana Kinerja Tahunan',
    url: 'rencana-kinerja-tahunan',
  },
  {
    title: 'Perjanjian Kinerja',
    url: 'perjanjian-kinerja',
  },
  {
    title: 'Rencana Aksi',
    url: 'rencana-aksi',
  },
  {
    title: 'Realisasi Rencana Aksi',
    url: 'realisasi-rencana-aksi',
  },
];

export const dokumenGroup = [
  {
    title: 'Evaluasi',
    url: '#',
  },
  {
    title: 'LAKIP',
    url: '#',
  },
];

export function HomeSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar variant="floating">
      <SidebarHeader className="flex justify-center items-center mt-4">
        <p className="font-bold text-2xl">SIKeRS</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplikasi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aplikasiGroup.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <span className="font-semibold text-[15px]">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Dokumen</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dokumenGroup.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <span className="font-semibold text-[15px]">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mb-4">
        <p>User</p>
      </SidebarFooter>
    </Sidebar>
  );
}
