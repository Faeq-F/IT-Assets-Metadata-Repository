<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { dia, shapes, util } from '@joint/core/joint.mjs';

	export let id: string;
	export let assetName: string;
	export let assetLink: string;
	export let assetType: string;
	export let metadataFields: any;

	const modalStore = getModalStore();

	onMount(() => {
		class RectangleTwoLabels extends shapes.standard.Rectangle {
			defaults() {
				return {
					...super.defaults,
					type: 'custom.RectangleTwoLabels'
				};
			}

			preinitialize() {
				this.markup = util.svg/* xml */ `
            <rect @selector="body" />
            <text @selector="label" />
            <text @selector="labelSecondary" />
        `;
			}
		}

		const namespace = { ...shapes, custom: { RectangleTwoLabels } };

		const graph = new dia.Graph({}, { cellNamespace: namespace });

		const paper = new dia.Paper({
			el: document.getElementById('myholder'),
			model: graph,
			width: 600,
			height: 100,
			gridSize: 1,
			cellViewNamespace: namespace
		});

		// Add this code to load cells from JSON
		graph.fromJSON({
			cells: [
				{
					type: 'standard.Rectangle',
					size: { width: 100, height: 60 },
					position: { x: 50, y: 50 },
					attrs: {
						body: { fill: '#C9ECF5' },
						label: { text: 'standard.Rectangle', textWrap: { width: 'calc(w-10)' } }
					}
				},
				{
					type: 'custom.RectangleTwoLabels',
					size: { width: 140, height: 80 },
					position: { x: 200, y: 30 },
					attrs: {
						body: { fill: '#F5BDB0' },
						label: { text: 'custom.RectangleTwoLabels', textWrap: { width: 'calc(w-10)' } },
						labelSecondary: {
							text: 'SecondaryLabel',
							x: 'calc(w/2)',
							y: 'calc(h+15)',
							textAnchor: 'middle',
							textVerticalAnchor: 'middle',
							fontSize: 14
						}
					}
				}
			]
		});
	});

	// 	class RectangleTwoLabels extends shapes.standard.Rectangle {
	// 		defaults() {
	// 			return {
	// 				...super.defaults,
	// 				type: 'custom.RectangleTwoLabels'
	// 			};
	// 		}

	// 		preinitialize() {
	// 			this.markup = joint.util.svg/* xml */ `
	//         <rect @selector="body" />
	//         <text @selector="label" />
	//         <text @selector="labelSecondary" />
	//     `;
	// 		}
	// 	}
	// 	const namespace = { ...shapes, custom: { RectangleTwoLabels }};
	// 	const graph = new dia.Graph({}, { cellNamespace: namespace });

	// 	const paper = new dia.Paper({
	// 		el: document.getElementById('myholder'),
	// 		model: graph,
	// 		width: 600,
	// 		height: 100,
	// 		gridSize: 1,
	// 		cellViewNamespace: namespace
	// 	});

	// 	const rect = new shapes.standard.Rectangle();
	// 	rect.position(100, 30);
	// 	rect.resize(100, 40);
	// 	//rect.type("custom.RectangleTwoLabels");
	// 	rect.attr({
	// 		body: {
	// 			fill: 'blue'
	// 		},
	// 		label: {
	// 			text: assetName,
	// 			fill: 'white'
	// 		},
	// 		labelSecondary: {
	// 			text: 'SecondaryLabel',
	// 			x: 'calc(w/2)',
	// 			y: 'calc(h+15)',
	// 			textAnchor: 'middle',
	// 			textVerticalAnchor: 'middle',
	// 			fontSize: 14
	// 		}

	// 	});
	// 	rect.addTo(graph);

	// 	const rect2 = rect.clone();
	// 	rect2.translate(300, 0);
	// 	rect2.attr('label/text', 'World!');
	// 	rect2.addTo(graph);

	// 	const link = new shapes.standard.Link();
	// 	link.source(rect);
	// 	link.target(rect2);
	// 	link.addTo(graph);
	// });
</script>

<div class="bg-surface-100-800-token h-screen w-screen p-52">
	<div class="m-9">
		<i style="font-size: 1.7em;" class="fa-solid fa-fingerprint inline"></i>
		<p class="h3 mt-1 inline">{id}</p>
	</div>
	<div class="ml-14">
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
				⦿ {field}:
				{#if Array.isArray(value)}
					{#each value as item}
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp; ⦿ {item}
					{/each}
				{:else}
					{value}
				{/if}
				<br />
			{/each}
		</div>
		<div id="myholder"></div>
	</div>
</div>

<button
	class="variant-filled-primary btn absolute bottom-3 right-3"
	on:click={() => modalStore.close()}>Close</button
>
