'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <main className={`flex-1 w-full ${isHomepage ? '' : 'pt-20 sm:pt-24'}`}>
      {children}
    </main>
  );
}

