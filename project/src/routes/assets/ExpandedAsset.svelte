<script lang="ts">
	import { onMount } from 'svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { fetchDocumentByID, fetchDocuments } from '$lib/apiRequests';
	import AssociationCard from '$lib/components/cards/AssociationCard.svelte';
	import Update from '$lib/components/cards/auditTrail/Update.svelte';
	import Add from '$lib/components/cards/auditTrail/Add.svelte';
	import Remove from '$lib/components/cards/auditTrail/Remove.svelte';
	import User from '$lib/components/cards/auditTrail/User.svelte';
	import Original from '$lib/components/cards/auditTrail/Original.svelte';
	//@ts-ignore
	import { dia, shapes } from '@joint/core/joint.mjs';
	import getRandomColor from '$lib/scripts/randomThemeColor';

	export let id: string;
	export let assetName: string;
	export let assetLink: string;
	export let assetType: string;
	export let metadataFields: any;

	const modalStore = getModalStore();

	async function displayTrailComponent(
		type: string,
		key: string,
		value: string,
		oldValue: string | undefined
	) {
		if (('' + value).startsWith('DOCUMENT-ID: ')) {
			await fetchDocumentByID(value.replace('DOCUMENT-ID: ', '')).then(async (doc) => {
				value = '*Deleted item*';
				if (doc.assetName) value = doc.assetName;
				else if (doc.username) value = doc.username;
			});
		}
		if (oldValue != undefined && (oldValue + '').startsWith('DOCUMENT-ID: ')) {
			await fetchDocumentByID(oldValue.replace('DOCUMENT-ID: ', '')).then(async (doc) => {
				value = '*Deleted item*';
				if (doc.assetName) oldValue = doc.assetName;
				else if (doc.username) oldValue = doc.username;
			});
		}
		if (type == 'UPDATE') {
			new Update({
				target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
				props: {
					key: key,
					newValue: value,
					oldValue: oldValue
				}
			});
		} else if (type == 'ADD') {
			new Add({
				target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
				props: {
					key: key,
					newValue: value
				}
			});
		} else {
			new Remove({
				target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
				props: {
					key: key,
					value: value
				}
			});
		}
	}

	async function parseDiff(diff: any) {
		for (const item of diff) {
			if (item.changes && Array.isArray(item.changes)) {
				await parseChanges(item.changes);
			} else {
				await displayTrailComponent(item.type, item.key, item.value, item.oldValue);
			}
		}
	}

	async function parseChanges(changes: any) {
		for (const change of changes) {
			if (change.changes && Array.isArray(change.changes)) {
				await parseChanges(change.changes);
			} else {
				await displayTrailComponent(change.type, change.key, change.value, change.oldValue);
			}
		}
	}

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

	onMount(async () => {
		let nodesList: shapes.standard.Rectangle[] = [];
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
		paper.on('cell:pointerclick', async function (cellView: any) {
			let nodeWanted: shapes.standard.Rectangle;
			for (let i of nodesList) {
				if (i.attributes.attrs.label.extra == cellView.model.attributes.attrs.label.extra) {
					nodeWanted = i;
				}
			}
			if (nodeWanted) {
				await fetchDocumentByID(
					nodeWanted.attributes.attrs.label.extra.replace('DOCUMENT-ID: ', '')
				).then(async (doc) => {
					originalY = originalY + 100;
					if (doc.metadataFields) await addToGraph(nodeWanted, doc.metadataFields, originalY);
				});
			}
			paper.scaleContentToFit({ padding: 10 });
		});

		//function to create a node
		async function node(xPos: number, yPos: number, text: string): shapes.standard.Rectangle {
			const node = root.clone();
			await fetchDocumentByID(text.replace('DOCUMENT-ID: ', '')).then(async (doc) => {
				let txt = 'Deleted item';
				if (doc.assetName != undefined) txt = doc.assetName;
				else if (doc.username != undefined) txt = doc.username;
				node.position(xPos, yPos);
				node.resize(txt.length * 12, 60);
				node.attr({
					body: {
						fill: getRandomColor(),
						rx: 20,
						ry: 20
					},
					label: {
						text: txt,
						extra: text,
						fill: '#000000',
						fontSize: 18,
						fontWeight: 'bold',
						textShadow: '1px 1px 1px black'
					}
				});
				node.addTo(graph);
			});

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
		async function addToGraph(root: shapes.standard.Rectangle, metadataFields: any, yPos: number) {
			let counter = 1;
			for (let [field, value] of Object.entries(metadataFields)) {
				if (typeof value === 'string' && value.startsWith('DOCUMENT-ID: ')) {
					if (counter % 2 == 0) originalX = originalX - counter * 200;
					else originalX = originalX + counter * 200;
					let newNode = await node(originalX, yPos + 170, value);
					nodesList.push(newNode);
					link(root, newNode, field);
					counter++;
				} else if (
					Array.isArray(value) &&
					value.length > 0 &&
					typeof value[0] === 'string' &&
					value[0].startsWith('DOCUMENT-ID: ')
				) {
					for (let doc of value) {
						if (counter % 2 == 0) originalX = originalX - counter * 200;
						else originalX = originalX + counter * 200;
						let newNode = await node(originalX, yPos + 170, doc);
						nodesList.push(newNode);
						link(root, newNode, field);
						counter++;
					}
				}
			}
		}

		await addToGraph(root, metadataFields, originalY);

		paper.scaleContentToFit({ padding: 10 });
	});

	let expandedGraph = false;
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-24">
	<div class="h-full" style={expandedGraph ? 'overflow-y:hidden' : 'overflow-y:scroll'}>
		<div class="m-auto grid grid-cols-2 grid-rows-2 gap-4">
			<div class="" style={expandedGraph ? 'display: none;' : ''}>
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
							class="variant-soft chip m-0 ml-2 p-2 hover:variant-filled"
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
			<div
				class="card variant-ringed col-span-2 col-start-2 mr-4 overflow-y-scroll"
				id="auditTrailDiv"
				style={expandedGraph ? 'display: none;' : 'height:700px;'}
			>
				<!--Audit trail-->
				<p class="h3 mt-1 text-center font-bold">Audit Trail</p>
			</div>

			<div
				class="card variant-ringed col-span-2 row-start-2"
				id="GraphContainer"
				style={expandedGraph
					? 'position:absolute; height: 100vh; width:100vw; z-index:20; padding: 0; margin: 0;left:0; top:0;'
					: ''}
			>
				<button
					class="btn relative left-10 top-10 z-[20]"
					on:click|preventDefault={() => (expandedGraph = !expandedGraph)}
					><i class="fa-solid fa-up-right-and-down-left-from-center"></i></button
				>
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
