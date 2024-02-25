<script lang="ts">
	import '../app.pcss';
	//@ts-ignore
	import { page } from '$app/stores'; //Does work
	import { AppShell, Modal } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import NavBar from './NavBar.svelte';

	import { Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
</script>

<Toast zIndex="z-[1000]" />
<Modal />
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<svelte:fragment slot="header">
		{#if $page.url.pathname != '/' && $page.url.pathname != '/register'}
			<NavBar></NavBar>
		{/if}
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>

<style>
</style>
