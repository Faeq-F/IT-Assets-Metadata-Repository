<script lang="ts">
	import { fetchDocumentByID } from '$lib/apiRequests';
	import AssociationCard from '../AssociationCard.svelte';

	export let original: any;
</script>

<div class="card variant-ghost-surface m-2 p-4">
	<div class="font-bold">Original:</div>
	<!--Asset details-->
	<div class="ml-14">
		<div class="h4" style="margin:10px; font-weight: bold;">
			{original.assetName}
		</div>
		<div class="m-0 mb-1 p-0">
			<!--clickable link to asset-->
			<a
				style="font-weight: 500"
				class="variant-soft chip m-0 ml-2 p-2 hover:variant-filled"
				href={original.assetLink.startsWith('http')
					? original.assetLink
					: 'http://' + original.assetLink}
			>
				<span><i class="fa-solid fa-paperclip"></i></span><span>{original.assetLink}</span></a
			>
		</div>
		<div class="h6" style="margin:10px; font-weight: bold;">
			{original.assetType}
		</div>
		<hr style="height:1px;border:none;color:#333;background-color:#333;" />
		<div class="ml-2 mt-1 text-lg">
			<!-- metadata -->
			{#each Object.entries(original.metadataFields) as [field, value]}
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
									<AssociationCard {document} topLevel={false} />
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
							<AssociationCard {document} topLevel={false} />
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
