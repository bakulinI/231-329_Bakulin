import React, { FC } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return <main className="bg-auth min-h-screen bg-cover bg-center bg-repeat">{children}</main>;
};
