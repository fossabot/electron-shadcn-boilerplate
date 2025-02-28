/* eslint-disable promise/always-return */
import { app } from 'electron';
import EXIT_CODES from '../config/exit-codes';
import { createMainWindow } from './create-window';
import shortcuts from './shortcuts';
import { getSetting } from './store';
import windows from './windows';

const register = () => {
	/**
	 * Add app event listeners...
	 */

	app.on('activate', async () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (windows.mainWindow === null) await createMainWindow();
	});

	app.on('second-instance', () => {
		// Someone tried to run a second instance, we should focus our window.
		if (windows.mainWindow) {
			// If the window is minimized, we should restore it and focus it.
			if (windows.mainWindow.isMinimized()) windows.mainWindow.restore();
			windows.mainWindow.focus();
		}
	});

	app.on('will-quit', () => {
		// Unregister all shortcuts.
		shortcuts.unregisterAll();
	});

	// Sending a `SIGINT` (e.g: Ctrl-C) to an Electron app that registers
	// a `beforeunload` window event handler results in a disconnected white
	// browser window in GNU/Linux and macOS.
	// The `before-quit` Electron event is triggered in `SIGINT`, so we can
	// make use of it to ensure the browser window is completely destroyed.
	// See https://github.com/electron/electron/issues/5273
	app.on('before-quit', () => {
		app.releaseSingleInstanceLock();
		process.exit(EXIT_CODES.SUCCESS);
	});

	app.on('window-all-closed', () => {
		// Respect the OSX convention of having the application in memory even
		// after all windows have been closed
		if (process.platform !== 'darwin' || getSetting('quitOnWindowClose')) {
			app.quit();
		}
	});

	// Security measures
	app.on('web-contents-created', (_event, webContents) => {
		// Security #13: Prevent navigation
		// https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
		webContents.on('will-navigate', (event, _navigationUrl) => {
			event.preventDefault();
		});
	});
};

export default { register };
