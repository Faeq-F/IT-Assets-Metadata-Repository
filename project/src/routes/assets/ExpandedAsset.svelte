<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { fetchDocumentByID, fetchDocuments } from '$lib/apiRequests';
	import AssociationCard from '$lib/components/cards/AssociationCard.svelte';
	import Update from '$lib/components/cards/auditTrail/Update.svelte';
	import Add from '$lib/components/cards/auditTrail/Add.svelte';
	import Remove from '$lib/components/cards/auditTrail/Remove.svelte';
	import User from '$lib/components/cards/auditTrail/User.svelte';
	import { onMount } from 'svelte';
	import Original from '$lib/components/cards/auditTrail/Original.svelte';

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
			await fetchDocumentByID(value.replace('DOCUMENT-ID: ', '')).then((doc) => {
				if (doc.assetName != undefined) value = doc.assetName;
				else value = doc.username;
			});
		}
		if (oldValue != undefined && (oldValue + '').startsWith('DOCUMENT-ID: ')) {
			await fetchDocumentByID(oldValue.replace('DOCUMENT-ID: ', '')).then((doc) => {
				if (doc.assetName != undefined) oldValue = doc.assetName;
				else oldValue = doc.username;
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
			//create add component
		} else {
			//create removed component
		}
	}

	function parseDiff(diff: any) {
		for (const item of diff) {
			if (item.changes && Array.isArray(item.changes)) {
				parseChanges(item.changes);
			} else {
				displayTrailComponent(item.type, item.key, item.value, item.oldValue);
				console.log(
					`Type: ${item.type}, Key: ${item.key}, Value: ${item.value}, Old Value: ${item.oldValue}`
				);
			}
		}
	}

	function parseChanges(changes: any) {
		for (const change of changes) {
			if (change.changes && Array.isArray(change.changes)) {
				parseChanges(change.changes);
			} else {
				displayTrailComponent(change.type, change.key, change.value, change.oldValue);
				console.log(
					`Type: ${change.type}, Key: ${change.key}, Value: ${change.value}, Old Value: ${change.oldValue}`
				);
			}
		}
	}

	onMount(async () => {
		fetchDocuments('diff').then((diffs): any => {
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
						parseDiff(j.changes);
					}
				}
			}
		});
	});
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-24">
	<div class="h-full max-h-full overflow-y-scroll">
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
			<div
				class="card variant-ringed col-span-2 col-start-2 mr-4 overflow-y-scroll"
				id="auditTrailDiv"
			>
				<!--Audit trail-->
				<p class="h3 mt-1 text-center font-bold">Audit Trail</p>
				<User username="SOmeUser" time="12th January 2023, 12:05pm" />
				<Add key="Test key" newValue="value0987" />
				<User username="SOmeUser" time="12th January 2023, 12:05pm" />
				<Update key="Test key" oldValue="value123" newValue="value0987" />
				<Update key="Test key" oldValue="value123" newValue="value0987" />
				<User username="SOmeUser" time="12th January 2023, 12:05pm" />
				<Update key="Test key" oldValue="value123" newValue="value0987" />
				<Update key="Test key" oldValue="value123" newValue="value0987" />
				<Update key="Test key" oldValue="value123" newValue="value0987" />
				<User username="SOmeUser" time="12th January 2023, 12:05pm" />
				<Remove key="Test key" value="empty" />
			</div>
			<div class="card variant-ringed col-span-2 row-start-2">
				<!--Associations graph-->
				<p style="">Association graph will go here</p>
			</div>
		</div>
	</div>
</div>

<button
	{...$$restProps}
	class="variant-filled-primary btn absolute bottom-3 right-3"
	on:click={() => modalStore.close()}>Close</button
>
