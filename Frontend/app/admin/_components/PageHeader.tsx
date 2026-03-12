'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, showBackButton = true, children }: PageHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  const getModuleName = () => {
    if (pathname.startsWith('/enhanced-tms')) {
      return 'Enhanced TMS';
    } else if (pathname.startsWith('/admin')) {
      return 'Admin Panel';
    }
    return 'PRIMA';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <div className="border-l border-gray-300 pl-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                {getModuleName()}
              </span>
              <span className="text-gray-400">•</span>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}