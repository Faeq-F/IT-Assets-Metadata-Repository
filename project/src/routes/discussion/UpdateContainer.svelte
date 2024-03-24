<script lang="ts">
	import { fetchDocumentByID, updateDocument } from '$lib/apiRequests';
	import InputAssociation from '$lib/components/customInputs/InputAssociation.svelte';
	import { getModalStore, getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	toastStore.trigger({
		message: 'You may have to refresh teh association list',
		background: 'variant-ghost-warning',
		timeout: 3000
	});

	async function makeType() {
		let containers = $modalStore[0].meta.boardDoc.Containers.filter(
			(containerCurr: any) => containerCurr != $modalStore[0].meta.container
		);
		if (name && description) {
			//get the values
			let values: any[] = [];
			let input = document.getElementById('values')?.getElementsByTagName('input');
			if (input && input[0]) {
				let key = input[0].id.replace('-association', '').replace('-InputList', '');
				let item = document
					.getElementById(key + '-associationCollector')
					?.getElementsByTagName('LI');
				if (item) {
					let newArr = [];
					for (let j of item) {
						let object = (j as HTMLElement).dataset.associatedobject;
						if (object) newArr.push('DOCUMENT-ID: ' + JSON.parse(object).value);
					}
					values = newArr;
				}
			}
			//add it to the list of containers
			containers.push({
				ContainerName: name,
				ContainerDescription: description,
				ContainerType: $modalStore[0].meta.container.ContainerType,
				ContainerValues: values
			});
			//construct the final obj
			const data = new FormData();
			data.append(
				'newData',
				JSON.stringify({
					BoardCreator: $modalStore[0].meta.boardDoc.BoardCreator,
					BoardName: $modalStore[0].meta.boardDoc.BoardName,
					Containers: containers,
					Description: $modalStore[0].meta.boardDoc.Description,
					Messages: $modalStore[0].meta.boardDoc.Messages
				})
			);
			updateDocument('DisscussionBoards', $modalStore[0].meta.boardDoc._id, data).then(
				(response) => {
					console.log(response);
					toastStore.trigger({
						message: 'Container Updated',
						background: 'variant-ghost-success',
						timeout: 3000
					});
					// Refresh the page
					location.reload();
					modalStore.close();
				}
			);
		} else {
			toastStore.trigger({
				message: 'Please fill in all of the fields',
				background: 'variant-ghost-error',
				timeout: 3000
			});
		}
	}

	//copy and paste
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

	let name: string = $modalStore[0].meta.container.ContainerName;
	let description: string = $modalStore[0].meta.container.ContainerDescription;
	const requiredField: PopupSettings = {
		event: 'hover',
		target: 'requiredField',
		placement: 'top'
	};
</script>

<div class="bg-initial card p-4" data-popup="requiredField">
	<p>Required Field</p>
	<div class="bg-initial arrow" />
</div>

<div class="makeAssets card p-5 shadow-xl" id="makeTypePopup">
	<div class="card bg-modern-50 h-full p-5">
		<header class="h2 card-header text-center">Update Container</header>
		<br /><br />
		<form id="rootCreateTypeForm">
			<label for="typeName" class="formlabel text-center">
				<p class="p-1">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Container Name:
				</p>
				<input
					type="text"
					id="typeName"
					name="typeName"
					placeholder="Enter name"
					data-focusindex="0"
					class="input w-96"
					bind:value={name}
				/>
			</label>
			<br />
			<label for="Description" class="formlabel text-center">
				<p class="p-4">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Description:
				</p>
				<textarea
					id="Description"
					name="Description"
					placeholder="Enter Description"
					data-focusindex="0"
					class="input w-9/12 rounded-2xl"
					style="resize: both; overflow:auto;"
					rows="4"
					bind:value={description}
				/>
			</label>
			<br />
			<label id="values" for="assetType" class="formlabel text-center">
				<p class="p-4 text-center">Values:</p>
				{#if $modalStore[0].meta.container.ContainerType == 'Assets'}
					<InputAssociation
						list
						fieldName="Values"
						associationType="Asset"
						presavedAssociation={generatePreSavedAssociations(
							$modalStore[0].meta.container.ContainerValues,
							'Asset'
						)}
						style="margin: 5px auto;"
					/>
				{:else}
					<InputAssociation
						list
						fieldName="Values"
						associationType="User"
						presavedAssociation={generatePreSavedAssociations(
							$modalStore[0].meta.container.ContainerValues,
							'User'
						)}
						style="margin: 5px auto;"
					/>
				{/if}
			</label>
			<br />
			<hr />
			<br />
			<button
				class="variant-filled-primary btn w-52"
				style="margin: 0 auto; display:block;"
				id="assetMaker"
				on:click|preventDefault={makeType}>Update Container</button
			>
		</form>
	</div>
</div>

<style>
	.makeAssets {
		height: 70vh;
		width: 70vw;
	}

	form {
		position: relative;
		top: initial;
	}

	#rootCreateTypeForm {
		height: 75%;
		overflow-y: scroll;
	}
</style>
