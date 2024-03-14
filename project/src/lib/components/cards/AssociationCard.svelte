<script lang="ts">
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import ExpandedAsset from '../../../routes/assets/ExpandedAsset.svelte';
	import ExpandedUser from '../../../routes/profile/ExpandedUser.svelte';
	import { highlight } from '../../scripts/keywordSearch';

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
		expandModalComponent = {
			ref: ExpandedAsset,
			props: {
				id: document._id,
				assetName: document.assetName,
				assetLink: document.assetLink,
				assetType: document.assetType,
				metadataFields: document.metadataFields
			}
		};
	} else {
		associationType = 'User';
		expandModalComponent = {
			ref: ExpandedUser,
			props: {
				id: document._id,
				username: document.username,
				email: document.email,
				role: document.role
			}
		};
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
