import QrScanner from 'qr-scanner';
import { SvelteSet } from 'svelte/reactivity';

export class ScanPresenter {
	private scanner: QrScanner | null = null;
	public scannedCodes: SvelteSet<string> = $state(new SvelteSet<string>());
	private detected: Set<string> = new Set();

	private processQrCode(data: string): void {
		if (this.detected.has(data)) return;
		this.detected.add(data);
		this.scannedCodes.add(data);
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

	removeCode(code: string): void {
		this.scannedCodes.delete(code);
		this.detected.delete(code);
	}
}
