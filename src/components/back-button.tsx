'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { MoveLeft } from 'lucide-react';

const BackButton = () => {
  const router = useRouter();
  return (
    <Button variant="ghost" size="icon" onClick={() => router.back()}>
      <MoveLeft />
    </Button>
  );
};

export default BackButton;
