<script lang="ts">
	import { fetchDocumentByID } from '$lib/apiRequests';
	import AssociationCard from '$lib/components/cards/AssociationCard.svelte';
	export let container: any;
</script>

<div id="container" class="card card-hover bg-modern-50 border-2">
	<h4 class="h5">{container.ContainerName}</h4>
	{container.ContainerDescription}
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
		border-color: plum;
	}
</style>
