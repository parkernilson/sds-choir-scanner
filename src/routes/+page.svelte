<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ScanPresenter } from '$lib/presenters/ScanPresenter.svelte';

	const presenter = new ScanPresenter();
	let videoElement: HTMLVideoElement;

	onMount(() => presenter.setup(videoElement));
	onDestroy(() => presenter.destroy());
</script>

<svelte:head>
	<title>QR Scanner</title>
</svelte:head>

<main class="container mx-auto p-4">
	<h1 class="mb-6 text-center text-3xl font-bold">QR Scanner</h1>

	<!-- Video -->
	<div class="mx-auto max-w-md">
		<video
			bind:this={videoElement}
			autoplay
			muted
			playsinline
			class="aspect-square w-full rounded object-cover"
		></video>
	</div>

	<!-- Scanned codes list -->
	<div class="mx-auto mt-8 max-w-md">
		<h2 class="mb-4 text-xl font-semibold">Scanned Codes ({presenter.scannedCodes.size})</h2>

		{#if presenter.scannedCodes.size === 0}
			<p class="py-8 text-center text-gray-500">No codes scanned yet</p>
		{:else}
			<div class="space-y-2">
				{#each [...presenter.scannedCodes] as code (code)}
					<div class="flex items-center gap-2 rounded border border-blue-200 bg-blue-50 p-3">
						<code class="flex-1 break-all text-sm">{code}</code>
						<button
							onclick={() => presenter.removeCode(code)}
							class="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
						>
							Remove
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>
