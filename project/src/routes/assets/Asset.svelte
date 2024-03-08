<script lang="ts">
	import {
		getModalStore,
		getToastStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';

	import { deleteDocument, fetchDocumentByID } from '$lib/apiRequests';
	import ExpandedAsset from './ExpandedAsset.svelte';
	import { highlight } from './keywordSearch';
	import UpdateAsset from './UpdateAsset.svelte';
	const toastStore = getToastStore();
	import Cookies from 'js-cookie';

	export let name: string;
	export let id: string;
	export let link: string;
	export let type: string;
	export let metadata: any;
	export let keywordSearchInput: string[] = [];

	let role = Cookies.get('savedLogin-role');
	const modalStore = getModalStore();

	const expandModalComponent: ModalComponent = {
		ref: ExpandedAsset,
		props: { id: id, assetName: name, assetLink: link, assetType: type, metadataFields: metadata }
	};
	const expandModal: ModalSettings = {
		type: 'component',
		component: expandModalComponent,
		backdropClasses: '!p-0'
	};

	const updateModalComponent: ModalComponent = {
		ref: UpdateAsset,
		props: { id: id, assetName: name, assetLink: link, assetType: type, metadataFields: metadata }
	};
	const updateModal: ModalSettings = {
		type: 'component',
		component: updateModalComponent,
		backdropClasses: '!p-0'
	};

	async function deleteAsset() {
		await deleteDocument('Asset', id);
		toastStore.trigger({
			message: 'Asset deleted',
			background: 'variant-ghost-success',
			timeout: 3000
		});
		// Refresh the page
		location.reload();
	}

	let showMenu = 'none';
</script>

<div id="Asset" class="card card-hover bg-modern-50 drop-shadow-md">
	<!--Popup menu-->
	<div
		id="menuPopup"
		class="card card-hover p-3 drop-shadow-md"
		style="display: {showMenu}; position: absolute; right:10px; top: 10px; border-radius: 10px;"
	>
		<div class="">
			<button
				class="variant-filled-surface btn btn-sm card-hover m-1"
				on:click={() => modalStore.trigger(expandModal)}
			>
				<span><i class="fa-solid fa-maximize"></i></span>
				<span>Expand</span>
			</button>
			{#if role != 'viewer'}
				<button
					class="variant-filled-surface btn btn-sm card-hover m-1"
					on:click={() => modalStore.trigger(updateModal)}
				>
					<span><i class="fa-solid fa-pen"></i></span>
					<span>Edit</span>
				</button>
				<button class="variant-filled-surface btn btn-sm card-hover m-1" on:click={deleteAsset}>
					<span><i class="fa-solid fa-trash text-sm"></i></span>
					<span>Delete</span>
				</button>
			{/if}
		</div>
	</div>
	<!--menu button-->
	<div id="ButtonActions">
		<button
			type="button"
			class="btn btn-sm"
			on:click={() => (showMenu == 'none' ? (showMenu = 'initial') : (showMenu = 'none'))}
			><i class="fa-solid fa-ellipsis-vertical"></i></button
		>
	</div>
	<!--asset details-->
	<!-- eslint-disable svelte/no-at-html-tags-->
	<div class="h3" style="margin:10px; font-weight: bold; margin-bottom: 3px;">{@html name}</div>
	<div class="m-0 mb-1 p-0">
		<a
			style="font-weight: 500"
			class="variant-soft chip hover:variant-filled m-0 ml-2 p-2"
			href={link.startsWith('http') ? link : 'http://' + link}
		>
			<span><i class="fa-solid fa-paperclip"></i></span><span>{@html link}</span></a
		>
	</div>

	<div style="margin: 10px; font-weight: 500; margin-top:0;">{@html type}</div>
	<hr />
	<div class="ml-2 mt-1">
		<!-- metadata -->
		{#each Object.entries(metadata) as [field, value]}
			<!-- eslint-disable svelte/no-at-html-tags-->
			⦿ {@html highlight(field, keywordSearchInput)}:
			{#if Array.isArray(value)}
				{#each value as item}
					<br />
					{#if (item + '').startsWith('DOCUMENT-ID: ')}
						{#await fetchDocumentByID(('' + item).replace('DOCUMENT-ID: ', ''))}d
							&nbsp;&nbsp;&nbsp;&nbsp; ⦿ <span>Loading association</span>
						{:then document}
							&nbsp;&nbsp;&nbsp;&nbsp; ⦿ {JSON.stringify(document)}
						{/await}
					{:else}
						<!-- eslint-disable svelte/no-at-html-tags-->
						&nbsp;&nbsp;&nbsp;&nbsp; ⦿ {@html highlight(item, keywordSearchInput)}
					{/if}
				{/each}
			{:else if (value + '').startsWith('DOCUMENT-ID: ')}
				{#await fetchDocumentByID(('' + value).replace('DOCUMENT-ID: ', ''))}
					<span>Loading association</span>
				{:then document}
					{JSON.stringify(document)}
				{/await}
			{:else}
				<!-- eslint-disable svelte/no-at-html-tags-->
				{@html highlight(value, keywordSearchInput)}
			{/if}
			<br />
		{/each}
	</div>
</div>

<style>
	#Asset {
		margin: 10px;
		padding: 10px;
		flex-grow: 1;
		position: relative;
	}

	#ButtonActions {
		position: absolute;
		top: 10px;
		right: 20px;
		width: 10px;
	}
</style>
