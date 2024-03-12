<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	//@ts-ignore
	import { dia, shapes } from '@joint/core/joint.mjs';
	import { fetchDocumentByID } from '$lib/apiRequests';
	import AssociationCard from '$lib/components/AssociationCard.svelte';

	export let id: string;
	export let assetName: string;
	export let assetLink: string;
	export let assetType: string;
	export let metadataFields: any;

	const modalStore = getModalStore();

	onMount(() => {
		//graph setup
		const graph = new dia.Graph({}, { cellNamespace: shapes });
		const paper = new dia.Paper({
			el: document.getElementById('associationsGraph'),
			model: graph,
			height: (document.getElementById('GraphContainer') as HTMLDivElement)?.offsetHeight,
			width: (document.getElementById('GraphContainer') as HTMLDivElement)?.offsetWidth,
			gridSize: 1,
			cellViewNamespace: shapes
		});
		paper.scaleContentToFit({ padding: 10 });

		//function to create a node
		function node(xPos: number, yPos: number, text: string): shapes.standard.Rectangle {
			const node = root.clone();
			node.position(xPos, yPos);
			node.attr({
				body: {
					fill: 'blue'
				},
				label: {
					text: text,
					fill: 'white'
				}
			});
			node.addTo(graph);
			return node;
		}

		//function to create a link
		function link(
			node1: shapes.standard.Rectangle,
			node2: shapes.standard.Rectangle,
			label: string
		) {
			const link = new shapes.standard.Link();
			link.appendLabel({
				attrs: {
					text: {
						text: label
					}
				}
			});
			link.source(node1);
			link.target(node2);
			link.addTo(graph);
		}

		//setup for creation
		let originalX =
			(document.getElementById('GraphContainer') as HTMLDivElement)?.offsetWidth / 2 - 50;
		let originalY = 30;

		//creating root node
		const root = new shapes.standard.Rectangle();
		root.position(originalX, originalY);
		root.resize(100, 40);
		root.attr({
			body: {
				fill: 'blue'
			},
			label: {
				text: assetName,
				fill: 'white'
			}
		});
		root.addTo(graph);

		//create the rest of the graph
		originalX = originalX + 200;
		for (let [field, value] of Object.entries(metadataFields)) {
			if (typeof value === 'string' && value.startsWith('DOCUMENT-ID: ')) {
				originalX = originalX - 200;
				let newNode = node(originalX, originalY + 170, value);
				link(root, newNode, field);
			} else if (
				Array.isArray(value) &&
				value.length > 0 &&
				typeof value[0] === 'string' &&
				value[0].startsWith('DOCUMENT-ID: ')
			) {
				for (let doc of value) {
					originalX = originalX - 200;
					let newNode = node(originalX, originalY + 170, doc);
					link(root, newNode, field);
				}
			}
		}
	});
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-24">
	<div class="h-full overflow-y-scroll">
		<div class="m-auto grid grid-cols-2 grid-rows-2 gap-4">
			<div class="">
				<!--Asset details-->
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
			<div class="card variant-ringed col-span-2 col-start-2 mr-4">
				<!--Audit trail-->
				<p style="">Audit trail here</p>
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
