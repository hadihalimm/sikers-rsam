'use client';

import { ChevronUp, User2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SidebarMenuButton } from '../ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const FooterDropdown = () => {
  const session = authClient.useSession();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="flex justify-between">
          <div className="flex gap-x-2 items-center">
            <User2 className="size-4" />
            <p className="font-semibold">{session.data?.user.name}</p>
          </div>
          <ChevronUp />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-56">
        <DropdownMenuItem>
          <span>Akun</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            authClient.signOut();
            router.push('/sign-in');
          }}>
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FooterDropdown;
