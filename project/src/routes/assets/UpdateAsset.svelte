<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { fetchDocuments, updateDocument } from '../api/apiRequests';
	const toastStore = getToastStore();

	export let id: string;
	export let assetName: string;
	export let assetLink: string;
	export let assetType: string;
	export let metadataFields: any;

	let NewAssetName: string = assetName;
	let NewAssetLink: string = assetLink;

	const modalStore = getModalStore();

	let activeTypes: any[] = [];
	fetchDocuments('AssetType').then((assetTypeDocuments) => {
		activeTypes = assetTypeDocuments;
	});

	function updateAsset() {
		let metadataObject = {};
		let inputs = document.getElementById('metadataFieldsDiv')?.getElementsByTagName('input');
		if (inputs) {
			let currentListName = '';
			let currentList = [];
			for (let i of inputs) {
				let input = i;
				if (input.previousSibling) {
					if (input.previousSibling.nodeValue?.includes('⦿')) {
						// i is an input for a list
						if (input.previousSibling.previousSibling?.previousSibling?.nodeName == '#text') {
							if (currentList.length > 0 && currentListName != '') {
								metadataObject = {
									...metadataObject,
									[currentListName]: currentList
								};
								currentListName = '';
								currentList = [];
							}
							//@ts-ignore
							currentListName =
								//@ts-ignore
								input.previousSibling.previousSibling?.previousSibling?.previousSibling
									.previousSibling?.previousSibling?.nodeValue;
							currentList = [];
							currentList.push(i.value);
						} else {
							currentList.push(i.value);
						}
					} else {
						if (currentList.length > 0 && currentListName != '') {
							metadataObject = {
								...metadataObject,
								[currentListName]: currentList
							};
							currentListName = '';
							currentList = [];
						}
						//The field name + its value
						metadataObject = {
							...metadataObject,
							//@ts-ignore
							[input.previousSibling.previousSibling?.nodeValue]: i.value
						};
					}
				}
			}
		}
		console.log(metadataObject);
		// var assetObject = {
		// 	assetName: name,
		// 	assetLink: link,
		// 	assetType: assetType,
		// 	metadataFields: metadataObject
		// };
		// console.log(NewTypeObject);
		// const data = new FormData();
		// data.append('newData', JSON.stringify(NewTypeObject));
		// updateDocument('AssetType', id, data).then((response) => {
		// 	console.log(response);
		// 	location.reload();
		// });
	}
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-52">
	<div class=" m-9">
		<i style="font-size: 1.7em;" class=" fa-solid fa-fingerprint inline"></i>
		<p class="h3 mt-1 inline">{id}</p>
	</div>
	<div class=" ml-14">
		<div class="h1" style="margin:10px; font-weight: bold;">
			<input
				class="input variant-form-material !rounded-lg"
				bind:value={NewAssetName}
				id="typeName"
				placeholder={assetName}
			/>
		</div>
		<div class="m-0 mb-1 p-0">
			<span><i class=" fa-solid fa-paperclip ml-3.5"></i></span><span
				><input
					class="input variant-form-material ml-3.5 w-11/12 !rounded-lg"
					bind:value={NewAssetLink}
					id="typeName"
					placeholder={assetLink}
				/></span
			>
		</div>
		<br />
		<hr />
		<br />
		<div class="h3" style="margin:10px; font-weight: bold;">
			{assetType} fields:
		</div>
		<div class="ml-2 mt-1 text-lg" id="metadataFieldsDiv">
			<!-- metadata -->
			{#each Object.entries(metadataFields) as [field, value]}
				⦿ {field}:
				{#if Array.isArray(value)}
					<br />
					{#each value as item}
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp; ⦿
						{#if typeof item === 'string'}
							<input type="text" placeholder={item} class="input w-96" value={item} />
						{:else}
							<input type="text" placeholder={'' + item} class="input w-96" value={item} />
						{/if}
						<br />
					{/each}
				{:else if typeof value === 'string'}
					<input type="text" placeholder={value} class="input w-96" {value} />
				{:else}
					<input type="text" placeholder={'' + value} class="input w-96" {value} />
				{/if}
				<br />
			{/each}
		</div>
	</div>
</div>
<div class="absolute bottom-3 right-36">
	<button
		class="variant-filled-primary btn m-2"
		on:click={() => {
			updateAsset();
			//modalStore.close();
		}}>Update</button
	>
	<button class="variant-filled-primary btn absolute m-2" on:click={() => modalStore.close()}
		>Close</button
	>
</div>
