<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import * as joint from 'jointjs';
	import { fetchDocumentByID, fetchDocuments } from '$lib/apiRequests';
	import AssociationCard from '$lib/components/cards/AssociationCard.svelte';

	import User from '$lib/components/cards/auditTrail/User.svelte';
	import Original from '$lib/components/cards/auditTrail/Original.svelte';
	import { parseDiff } from './AuditTrail';
	import { addToGraph, registerExpandingGraphHandler } from './AssociationGraph';

	export let id: string;
	export let assetName: string;
	export let assetLink: string;
	export let assetType: string;
	export let metadataFields: any;

	const modalStore = getModalStore();

	// load, parse and show diffs
	onMount(async () => {
		await fetchDocuments('diff').then(async (diffs) => {
			for (let i of diffs) {
				if (i.reference == id) {
					new Original({
						target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
						props: {
							original: i.original
						}
					});
					for (let j of i.diffs) {
						new User({
							target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
							props: {
								username: j.author,
								time: j.date + ' @ ' + j.time
							}
						});
						await parseDiff(j.changes);
					}
				}
			}
		});
	});

	// setup association graph
	onMount(async () => {
		//graph setup
		const graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
		const paper = new joint.dia.Paper({
			el: document.getElementById('associationsGraph'),
			model: graph,
			height: (document.getElementById('GraphContainer') as HTMLDivElement)?.offsetHeight,
			width: (document.getElementById('GraphContainer') as HTMLDivElement)?.offsetWidth,
			gridSize: 1,
			cellViewNamespace: joint.shapes
		});

		//setup for creation
		let originalX =
			(document.getElementById('GraphContainer') as HTMLDivElement)?.offsetWidth / 2 - 50;
		let originalY = 30;

		registerExpandingGraphHandler(paper, originalY, originalX, graph);

		//creating root node
		const root = new joint.shapes.standard.Rectangle();
		root.position(originalX, originalY);
		root.resize(assetName.length * 12, 60);
		root.attr({
			body: {
				fill: '#b012f3',
				rx: 20,
				ry: 20
			},
			label: {
				text: assetName,
				fill: '#E0E0FC',
				fontSize: 18,
				fontWeight: 'bold',
				textShadow: '1px 1px 1px black'
			}
		});
		root.addTo(graph);

		//create the rest of the graph
		originalX = originalX + 200;
		await addToGraph(root, metadataFields, originalY, originalX, graph);

		paper.scaleContentToFit({ padding: 10 });
	});
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-24">
	<div class="h-full" style="overflow-y:scroll">
		<div class="m-auto grid grid-cols-2 grid-rows-2 gap-4">
			<div class="">
				<!--Asset details-->
				<div class=" m-9">
					<i style="font-size: 1.7em;" class=" fa-solid fa-fingerprint inline"></i>
					<p class="h3 mt-1 inline">{id}</p>
				</div>
				<div class=" ml-14">
					<div class="h1" style="margin:10px; font-weight: bold;">
						<!-- eslint-disable svelte/no-at-html-tags-->
						{@html assetName}
					</div>
					<div class="m-0 mb-1 p-0">
						<a
							style="font-weight: 500"
							class="variant-soft chip m-0 ml-2 p-2 hover:variant-filled"
							href={assetLink.startsWith('http') ? assetLink : 'http://' + assetLink}
						>
							<!-- eslint-disable svelte/no-at-html-tags-->
							<span><i class="fa-solid fa-paperclip"></i></span><span>{@html assetLink}</span></a
						>
					</div>
					<div class="h3" style="margin:10px; font-weight: bold;">
						{@html assetType}
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
								⦿ {@html field}: {@html value}
							{/if}
							<br />
						{/each}
					</div>
				</div>
			</div>
			<div
				class="card variant-ringed col-span-2 col-start-2 mr-4 overflow-y-scroll"
				id="auditTrailDiv"
				style="height:700px;"
			>
				<!--Audit trail-->
				<p class="h3 mt-1 text-center font-bold">Audit Trail</p>
			</div>

			<div class="card variant-ringed col-span-2 row-start-2" id="GraphContainer">
				<!--Associations graph-->
				<div id="associationsGraph" class="h-full w-full"></div>
			</div>
		</div>
	</div>
</div>

<button
	{...$$restProps}
	class="variant-filled-primary btn absolute bottom-3 right-3"
	on:click={() => modalStore.close()}>Close</button
>
