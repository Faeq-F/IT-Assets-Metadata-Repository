<script lang="ts">
	import '../app.pcss';
	//@ts-ignore
	import { page, navigating } from '$app/stores'; //Does work
	import { AppShell, Drawer, Modal, ProgressRadial, getDrawerStore } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import FilterDrawer from './assets/filterDrawer.svelte';
	import { fade } from 'svelte/transition';
	import NavBar from './NavBar.svelte';
	initializeStores();
	const drawerStore = getDrawerStore();
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

{#if Boolean($navigating)}
	<div class="z-10" in:fade={{ duration: 150 }} id="LoadingSpinner">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<Toast zIndex="z-[1000]" />
	<Modal />
	<Drawer>
		{#if $drawerStore.id === 'filterAssetsDrawer'}
			<FilterDrawer />
		{/if}
	</Drawer>
	<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64 ">
		<svelte:fragment slot="header">
			{#if $page.url.pathname != '/' && $page.url.pathname != '/register' && $page.url.pathname != '/shared'}
				<NavBar></NavBar>
			{/if}
		</svelte:fragment>
		<!-- Page Route Content -->
		<slot />
	</AppShell>
{/if}

<style>
	#LoadingSpinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
