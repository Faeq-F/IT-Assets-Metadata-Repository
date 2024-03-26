<script lang="ts">
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { highlight } from '$lib/scripts/keywordSearch';
	import { produceExpandModalComponent } from './AssociationCard';

	export let topLevel = true;
	let modalStore: any;
	if (topLevel) {
		modalStore = getModalStore();
	}

	export let document: any;
	export let keywordSearchInput: string[] = [];

	let associationType = '';
	let expandModalComponent: ModalComponent;

	if (document.assetName != undefined) {
		associationType = 'Asset';
		expandModalComponent = produceExpandModalComponent(document, associationType);
	} else {
		associationType = 'User';
		expandModalComponent = produceExpandModalComponent(document, associationType);
	}

	const expandModal: ModalSettings = {
		type: 'component',
		component: expandModalComponent,
		backdropClasses: '!p-0'
	};
</script>

<div class=" inline rounded-full">
	{#if associationType == 'Asset'}
		<button
			class="inline"
			on:click={() => {
				topLevel ? modalStore.trigger(expandModal) : console.log('Not on top level component');
			}}
		>
			<!-- eslint-disable svelte/no-at-html-tags-->
			{@html highlight(document.assetName, keywordSearchInput)}
		</button>
	{:else}
		<button
			class="inline"
			on:click={() => {
				topLevel ? modalStore.trigger(expandModal) : console.log('Not on top level component');
			}}
		>
			<!-- eslint-disable svelte/no-at-html-tags-->
			{@html highlight(document.username, keywordSearchInput)}
		</button>
	{/if}
</div>

<style></style>
