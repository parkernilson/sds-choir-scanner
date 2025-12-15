import QrScanner from 'qr-scanner';
import { SvelteSet } from 'svelte/reactivity';

export class ScanPresenter {
	private scanner: QrScanner | null = null;
	public scannedIds: SvelteSet<string> = $state(new SvelteSet<string>());
	private detected: Set<string> = new Set();

	private validateAndExtractIds(data: string): string[] | null {
		try {
			const url = new URL(data);

			// Validate hostname and pathname
			if (url.hostname !== 'parkernilson.github.io' || url.pathname !== '/sds-choir-scanner') {
				return null;
			}

			// Extract and parse item parameter
			const itemParam = url.searchParams.get('item');
			if (!itemParam) return null;

			// Split by comma, trim whitespace, filter empty strings
			const ids = itemParam
				.split(',')
				.map((id) => id.trim())
				.filter((id) => id.length > 0);

			return ids.length > 0 ? ids : null;
		} catch {
			return null; // Invalid URL
		}
	}

	private processQrCode(data: string): void {
		// Prevent processing same URL multiple times
		if (this.detected.has(data)) return;
		this.detected.add(data);

		// Validate and extract IDs
		const ids = this.validateAndExtractIds(data);
		if (!ids) return; // Invalid URL, silently ignore

		// Add each new ID
		ids.forEach((id) => {
			this.scannedIds.add(id);
		});
	}

	setup(videoElement: HTMLVideoElement): void {
		this.scanner = new QrScanner(
			videoElement,
			(result) => this.processQrCode(result.data),
			{ preferredCamera: 'environment' }
		);
		this.scanner.start();
	}

	destroy(): void {
		if (this.scanner) {
			this.scanner.destroy();
			this.scanner = null;
		}
	}

	removeCode(id: string): void {
		this.scannedIds.delete(id);
		// Note: Don't remove from detected Set - we still want to remember
		// we scanned that URL to avoid reprocessing if scanned again
	}

	getCheckoutUrl(): string {
		const ids = [...this.scannedIds].join(',');
		return `https://sheets.google.com/12345?ids=${ids}`;
	}
}
