<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { fetchDocumentByID } from '$lib/apiRequests';
	import AssociationCard from '../../lib/components/AssociationCard.svelte';

	export let id: string;
	export let assetName: string;
	export let assetLink: string;
	export let assetType: string;
	export let metadataFields: any;

	const modalStore = getModalStore();
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-24">
	<div class="h-full overflow-y-scroll">
		<div class=" m-9">
			<i style="font-size: 1.7em;" class=" fa-solid fa-fingerprint inline"></i>
			<p class="h3 mt-1 inline">{id}</p>
		</div>
		<div class=" ml-14">
			<div class="h1" style="margin:10px; font-weight: bold;">
				{assetName}
			</div>
			<div class="m-0 mb-1 p-0">
				<a
					style="font-weight: 500"
					class="variant-soft chip hover:variant-filled m-0 ml-2 p-2"
					href={assetLink.startsWith('http') ? assetLink : 'http://' + assetLink}
				>
					<span><i class="fa-solid fa-paperclip"></i></span><span>{assetLink}</span></a
				>
			</div>
			<div class="h3" style="margin:10px; font-weight: bold;">
				{assetType}
			</div>
			<br />
			<hr />
			<br />
			<div class="ml-2 mt-1 text-lg">
				<!-- metadata -->
				{#each Object.entries(metadataFields) as [field, value]}
					{#if Array.isArray(value)}
						⦿ {field}:
						{#each value as item}
							<br />
							{#if (item + '').startsWith('DOCUMENT-ID: ')}
								{#await fetchDocumentByID(('' + item).replace('DOCUMENT-ID: ', ''))}
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
							{:else}
								<!-- eslint-disable svelte/no-at-html-tags-->
								&nbsp;&nbsp;&nbsp;&nbsp; ⦿ {item}
							{/if}
						{/each}
					{:else if (value + '').startsWith('DOCUMENT-ID: ')}
						{#await fetchDocumentByID(('' + value).replace('DOCUMENT-ID: ', ''))}
							<i class="fa-solid fa-stroopwafel"></i> {field}: <span>Loading association</span>
						{:then document}
							{#if Object.keys(document).length == 0}
								<i class="fa-solid fa-stroopwafel"></i>
								{field}: <span style="color: red; font-weight: bold;">Deleted item</span>
							{:else}
								<i class="fa-solid fa-stroopwafel"></i>
								{field}:
								<AssociationCard {document} />
							{/if}
						{/await}
					{:else}
						<!-- eslint-disable svelte/no-at-html-tags-->
						⦿ {field}: {value}
					{/if}
					<br />
				{/each}
			</div>
		</div>
	</div>
</div>

<button
	{...$$restProps}
	class="variant-filled-primary btn absolute bottom-3 right-3"
	on:click={() => modalStore.close()}>Close</button
>
