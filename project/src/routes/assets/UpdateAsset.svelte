<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { fetchDocumentByID, updateDocument, fetchDocuments } from '$lib/apiRequests';
	import InputAssociation from '../../lib/components/customInputs/InputAssociation.svelte';
	import InputList from '../../lib/components/customInputs/InputList.svelte';
	import Cookies from 'js-cookie';
	import { diff } from 'json-diff-ts';

	const toastStore = getToastStore();
	toastStore.trigger({
		message: 'You may have to refresh association lists',
		background: 'variant-ghost-warning',
		timeout: 3000
	});

	export let id: string;
	export let assetName: string;
	export let assetLink: string;
	export let assetType: string;
	export let metadataFields: any;

	let NewAssetName: string = assetName;
	let NewAssetLink: string = assetLink;

	const modalStore = getModalStore();

	function emptyFieldAlert() {
		toastStore.trigger({
			message: 'Please fill in all of the fields',
			background: 'variant-ghost-error',
			timeout: 3000
		});
	}
	/**
	 * Gets edited asset values and inserts new asset into required databases
	 * @author ...
	 * @email
	 * @author Christian-Frederick Cubos
	 * @email zlac145@live.rhul.ac.uk
	 */
	async function updateAsset() {
		if (NewAssetName == '' || NewAssetLink == '') {
			emptyFieldAlert();
			return;
		}
		let metadataObject = {};
		let inputs = document.getElementById('metadataFieldsDiv')?.getElementsByTagName('input');
		if (inputs) {
			for (let input of inputs) {
				//input is for a list of text or numbers
				if (input.id.endsWith('-InputList')) {
					//get the elements with the values of the list
					let collection = document
						.getElementById(input.id.replace('-InputList', '') + '-ListInputCollector')
						?.getElementsByTagName('li');
					if (collection) {
						// save each value in an array
						let listArr: any[] = [];
						for (let j of collection) {
							//get the value from the element
							let iVal: any = (j as HTMLLIElement).innerHTML;
							//parse it as a number, if needed
							if (input.type != 'text') iVal = parseFloat(iVal);
							//save to array
							listArr.push(iVal);
						}
						//save the list of values as the value for the field
						metadataObject = {
							...metadataObject,
							[input.id.replace('-InputList', '')]: listArr
						};
					}
				} else if (input.id.endsWith('-association')) {
					if (input.placeholder.includes('multiple')) {
						// The input is for a list of associations
						let items = document
							.getElementById(input.id.replace('-association', '') + '-associationCollector')
							?.getElementsByTagName('LI');
						//items is a list of saved associations from the custom input
						if (items) {
							let associationArr = [];
							for (let j of items) {
								//save each association in a list
								let object = (j as HTMLElement).dataset.associatedobject;
								if (object) associationArr.push('DOCUMENT-ID: ' + JSON.parse(object).value);
							}
							//save the list of associations as the value for the field
							metadataObject = {
								...metadataObject,
								[input.id.replace('-association', '')]: associationArr
							};
						}
					} else {
						// The input is for a single association
						let item = document
							.getElementById(input.id.replace('-association', '') + '-associationCollector')
							?.getElementsByTagName('LI');
						//item is the saved association from the custom input
						if (!(item == undefined || item.length == 0)) {
							let liItem = (item[0] as HTMLElement).dataset.associatedobject;
							//save the association
							if (liItem)
								metadataObject = {
									...metadataObject,
									[input.id.replace('-association', '')]: 'DOCUMENT-ID: ' + JSON.parse(liItem).value
								};
						}
					}
				} else {
					if (input.type == 'text') {
						// The input is a normal field for a single string of text
						metadataObject = { ...metadataObject, [input.id]: input.value };
					} else {
						// The input is a normal field for a single number
						metadataObject = { ...metadataObject, [input.id]: parseFloat(input.value) };
					}
				}
			}
		}

		var assetObject = {
			assetName: NewAssetName,
			assetLink: NewAssetLink,
			assetType: assetType,
			metadataFields: metadataObject
		};

		const data = new FormData();
		data.append('newData', JSON.stringify(assetObject));

		updateDocument('Asset', id, data)
			.then(async (response: any) => {
				console.log(response);
				// formatting date
				let current = new Date();
				let day = current.getDate();
				let month = current.getMonth() + 1;
				let year = current.getFullYear();
				let current_date = `${day}/${month}/${year}`;
				let current_time = current.toLocaleTimeString();

				var originalAsset = {
					assetName: assetName,
					assetLink: assetLink,
					assetType: assetType,
					metadataFields: metadataFields
				};

				// call import for diffs
				let diffslib = diff(originalAsset, assetObject);

				// formatting diffs
				var diffs = {
					author: Cookies.get('savedLogin-username'),
					date: current_date,
					time: current_time,
					changes: diffslib
				};

				var dbdiffs: any[] = [];
				var auditid: any;

				// getting original diff
				await fetchDocuments('diff').then((fetchdiffs: any) => {
					for (let i of fetchdiffs) {
						if (i.reference == id) {
							dbdiffs = i.diffs;
							auditid = i._id;
						}
					}
				});

				// append new diffs onto existing diff array from fetched audit trail
				dbdiffs.push(diffs);

				// remaking audit with new diff array
				var auditData = {
					reference: id,
					original: originalAsset,
					diffs: dbdiffs
				};

				// update the audit with new data
				const audit = new FormData();
				audit.append('newData', JSON.stringify(auditData));
				await updateDocument('diff', auditid, audit).then((response: any) => {
					console.log(response);
				});
			})
			.catch((error) => {
				if (error.message == 'Invalid user credentials') {
					alert(error.message);
				} else {
					alert('Updated asset');
					location.reload();
					toastStore.trigger({
						message: 'Asset updated',
						background: 'variant-ghost-success',
						timeout: 3000
					});
					modalStore.close();
				}
			});
	}

	function generatePreSavedAssociations(value: any, associationType: string) {
		let associations: any[] = [];
		const generation = new Promise((resolve) => {
			if (associationType == 'Asset') {
				for (let i of value) {
					fetchDocumentByID(i.replace('DOCUMENT-ID: ', '')).then(
						(document: { assetName: string; assetType: string; _id: any }) => {
							associations.push({
								label: document.assetName + ' (' + document.assetType + ')',
								value: document._id,
								meta: {
									name: document.assetName,
									extraDetail: document.assetType
								}
							});
						}
					);
				}
			} else {
				for (let i of value) {
					fetchDocumentByID(i.replace('DOCUMENT-ID: ', '')).then(
						(document: { username: string; email: string; _id: any }) => {
							associations.push({
								label: document.username + ' (' + document.email + ')',
								value: document._id,
								meta: {
									name: document.username,
									extraDetail: document.email
								}
							});
						}
					);
				}
			}
			resolve(associations);
		});
		Promise.resolve(generation);

		return associations;
	}
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-24">
	<div class="h-full overflow-y-scroll">
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
						{#if value.length > 0}
							{#if ('' + value[0]).startsWith('DOCUMENT-ID: ')}
								{#await fetchDocumentByID(value[0].replace('DOCUMENT-ID: ', ''))}
									<span>Loading associations</span>
								{:then document}
									{#if Object.keys(document).length == 0}
										<span style="color: red; font-weight: bold;"
											>The list references a deleted item & cannot recover - please reconstruct the
											list</span
										>
									{:else if document.assetName != undefined}
										<InputAssociation
											list={true}
											fieldName={field}
											associationType="Asset"
											presavedAssociation={generatePreSavedAssociations(value, 'Asset')}
										/>
									{:else}
										<InputAssociation
											list={true}
											fieldName={field}
											associationType="User"
											presavedAssociation={generatePreSavedAssociations(value, 'User')}
										/>
									{/if}
								{/await}
							{:else if typeof value[0] === 'string'}
								<InputList fieldName={field} dataType="text" presavedValues={value} />
							{:else}
								<InputList fieldName={field} dataType="number" presavedValues={value} />
							{/if}
						{/if}
					{:else if typeof value === 'string'}
						{#if value.startsWith('DOCUMENT-ID: ')}
							{#await fetchDocumentByID(value.replace('DOCUMENT-ID: ', ''))}
								<span>Loading association</span>
							{:then document}
								{#if Object.keys(document).length == 0}
									<span style="color: red; font-weight: bold;"
										>Deleted item (will be removed on update)</span
									>
								{:else if document.assetName != undefined}
									<InputAssociation
										list={false}
										fieldName={field}
										associationType="Asset"
										presavedAssociation={{
											label: document.assetName + ' (' + document.assetType + ')',
											value: document._id,
											meta: {
												name: document.assetName,
												extraDetail: document.assetType
											}
										}}
									/>
								{:else}
									<InputAssociation
										list={false}
										fieldName={field}
										associationType="User"
										presavedAssociation={{
											label: document.username + ' (' + document.email + ')',
											value: document._id,
											meta: {
												name: document.username,
												extraDetail: document.email
											}
										}}
									/>
								{/if}
							{/await}
						{:else}
							<input id={field} type="text" placeholder={value} class="input w-96" {value} />
						{/if}
					{:else}
						<input id={field} type="number" placeholder={'' + value} class="input w-96" {value} />
					{/if}
					<br />
				{/each}
			</div>
		</div>
	</div>
</div>
<div class="absolute bottom-3 right-36">
	<button
		class="variant-filled-primary btn m-2"
		on:click|preventDefault={() => {
			updateAsset();
		}}>Update</button
	>
	<button class="variant-filled-primary btn absolute m-2" on:click={() => modalStore.close()}
		>Cancel</button
	>
</div>
