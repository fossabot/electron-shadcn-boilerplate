import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import AppStatus from '@/renderer/components/footer/AppStatus';
import { Footer } from '@/renderer/components/footer/Footer';
import OnlineStatus from '@/renderer/components/footer/OnlineStatus';
import { Menu } from '@/renderer/components/menu/Menu';
import { StatusMessageContextProvider } from '@/renderer/context/status-message-context';
import { ThemeProvider } from '@/renderer/context/theme-context';

import React from 'react';
import { IsOnlineContextProvider } from 'react-is-online-context';

// We can't use the ScrollArea here or the scroll will persist between navigations
export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<div className="w-full h-full flex flex-col">
				<Menu className="shrink-0" />
				<div className="border-t grow flex min-h-0">
					<div className="grow min-w-0">
						<div className="flex h-full">
							<ScrollArea className="h-full w-full">{children}</ScrollArea>
						</div>
					</div>
				</div>
				<Footer>
					<IsOnlineContextProvider>
						<OnlineStatus />
					</IsOnlineContextProvider>
					<StatusMessageContextProvider>
						<AppStatus />
					</StatusMessageContextProvider>
				</Footer>
				<Toaster />
			</div>
		</ThemeProvider>
	);
}
