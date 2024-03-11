<script lang="ts">
	//@ts-ignore
	import { page } from '$app/stores'; //Does work
	import {
		getModalStore,
		getToastStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import ExpandedType from './ExpandedType.svelte';
	import { deleteDocument } from '$lib/apiRequests';
	import UpdateType from './UpdateType.svelte';
	import Cookies from 'js-cookie';
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	export let id: string;
	export let typeName: string;
	export let metadataFields: any[];
	export let viewType: number;

	let role = Cookies.get('savedLogin-role');

	const expandModalComponent: ModalComponent = {
		ref: ExpandedType,
		props: { id: id, typeName: typeName, metadataFields: metadataFields }
	};
	const expandModal: ModalSettings = {
		type: 'component',
		component: expandModalComponent,
		backdropClasses: '!p-0'
	};

	const updateModalComponent: ModalComponent = {
		ref: UpdateType,
		props: { id: id, typeName: typeName, metadataFields: metadataFields }
	};
	const updateModal: ModalSettings = {
		type: 'component',
		component: updateModalComponent,
		backdropClasses: '!p-0'
	};

	async function deleteAssetType() {
		await deleteDocument('AssetType', id);
		toastStore.trigger({
			message: 'Asset Type deleted',
			background: 'variant-ghost-success',
			timeout: 3000
		});
		// Refresh the page
		location.reload();
	}

	let showMenu = 'none';
</script>

<div
	id="Type"
	class="card card-hover bg-modern-50 drop-shadow-md"
	style={viewType != 0 ? 'width: 100%;' : ''}
>
	<div
		id="menuPopup"
		class="card card-hover p-3 drop-shadow-md"
		style="display: {showMenu}; position: absolute; right:10px; top: 10px; border-radius: 10px;"
	>
		<div class="">
			<button
				class="variant-filled-surface btn btn-sm card-hover m-1"
				on:click={() => {
					navigator.clipboard.writeText($page.url.origin + '/shared?type=' + id);
					toastStore.trigger({
						message: 'Copied link',
						background: 'variant-ghost-success',
						timeout: 3000
					});
				}}
			>
				<span><i class="fa-solid fa-share-nodes"></i></span>
				<span>Share</span>
			</button>
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
				<button class="variant-filled-surface btn btn-sm card-hover m-1" on:click={deleteAssetType}>
					<span><i class="fa-solid fa-trash text-sm"></i></span>
					<span>Delete</span>
				</button>
			{/if}
		</div>
	</div>
	<div id="ButtonActions">
		<button
			type="button"
			class="btn btn-sm"
			on:click={() => (showMenu == 'none' ? (showMenu = 'initial') : (showMenu = 'none'))}
			><i class="fa-solid fa-ellipsis-vertical"></i></button
		>
	</div>
	<div class="h3" style="margin:10px; font-weight: bold;">
		{typeName}
	</div>
	{#if viewType == 0}
		<div style="margin: 10px; font-weight: 500">Fields required:</div>
		<ul>
			{#each metadataFields as field}
				<li>
					⦿ {field.field}
					<span class="assetCard card variant-ghost-surface badge">{field.dataType}</span>
					{#if field.list}
						<span class="assetCard card variant-ghost-surface badge">Multi-value</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	#Type {
		margin: 10px;
		padding: 10px;
		flex-grow: 1;
		position: relative;
	}
	li {
		margin-top: 5px;
		margin-left: 20px;
	}
	li span {
		margin-left: 5px;
		padding: 2px 5px;
	}
	#ButtonActions {
		position: absolute;
		top: 10px;
		right: 20px;
		width: 10px;
	}
</style>
