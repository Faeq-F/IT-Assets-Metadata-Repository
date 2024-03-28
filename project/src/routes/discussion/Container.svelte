<script lang="ts">
	import { fetchDocumentByID } from '$lib/apiRequests';
	import AssociationCard from '$lib/components/cards/AssociationCard.svelte';
	import {
		AppBar,
		getModalStore,
		getToastStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import UpdateContainer from './UpdateContainer.svelte';
	import { deleteContainer } from './Container';
	const toastStore = getToastStore();
	export let container: any;
	export let boardDoc: any;

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: UpdateContainer };
	const updateModal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		meta: { boardDoc: boardDoc, container: container }
	};
</script>

<div id="container" class="card card-hover border-2 bg-modern-50">
	<AppBar background="transparent">
		<svelte:fragment slot="lead">
			<h4 class="h5">{container.ContainerName}</h4>
		</svelte:fragment>
		<svelte:fragment slot="trail">
			<button on:click={() => modalStore.trigger(updateModal)}
				><i class="fa-solid fa-pen"></i></button
			>
			<button on:click={() => deleteContainer(boardDoc, container, toastStore)}
				><i class="fa-solid fa-trash"></i></button
			>
		</svelte:fragment>
	</AppBar>
	<div class="pl-4">
		{container.ContainerDescription}
	</div>
	<br />
	<hr class="p-1" />
	<b>{container.ContainerType}:</b>
	<br />
	{#each container.ContainerValues as value}
		{#await fetchDocumentByID(('' + value).replace('DOCUMENT-ID: ', ''))}
			&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa-solid fa-stroopwafel"></i>
			<span>Loading association</span>
		{:then document}
			&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa-solid fa-stroopwafel"></i>
			{#if Object.keys(document).length == 0}
				<span style="color: red; font-weight: bold;">Deleted item</span>
			{:else}
				<AssociationCard {document} />
			{/if}
		{/await}
	{/each}
</div>

<style>
	#container {
		margin: 10px;
		padding: 15px;
		flex-grow: 1;
		position: relative;
		border-color: rgb(214, 195, 250);
	}
</style>
