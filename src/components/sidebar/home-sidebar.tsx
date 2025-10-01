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
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import FooterDropdown from './footer-dropdown';
import { auth } from '@/lib/auth';

interface HomeSidebarProps {
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  className?: string;
}

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
    url: '/indikator-kinerja-utama',
  },
  {
    title: 'Rencana Kinerja Tahunan',
    url: '/rencana-kinerja-tahunan',
  },
  {
    title: 'Perjanjian Kinerja',
    url: '/perjanjian-kinerja',
  },
  {
    title: 'Rencana Aksi',
    url: '/rencana-aksi',
  },
  {
    title: 'Realisasi Rencana Aksi',
    url: '/realisasi-rencana-aksi',
  },
];

export const dokumenGroup = [
  {
    title: 'Evaluasi',
    url: '/dokumen-evaluasi',
  },
  {
    title: 'LAKIP',
    url: '/dokumen-lakip',
  },
];

export const adminGroup = [
  {
    title: 'Daftar Pegawai',
    url: '/pegawai',
  },
  {
    title: 'Daftar Program',
    url: '/program',
  },
];

export function HomeSidebar({ className, session }: HomeSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" className={cn('', className)}>
      <SidebarHeader className="flex justify-center items-center mt-4">
        <p className="font-bold text-2xl">SIKeRS RSAM</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplikasi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aplikasiGroup.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.includes(item.url)}>
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
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.includes(item.url)}>
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

        {session?.user.roles?.includes('admin') && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminGroup.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(item.url)}>
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
        )}
      </SidebarContent>

      <SidebarFooter className="mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <FooterDropdown session={session} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
