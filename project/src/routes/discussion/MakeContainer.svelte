<script lang="ts">
	import { updateDocument } from '$lib/apiRequests';
	import InputAssociation from '$lib/components/customInputs/InputAssociation.svelte';
	import { getModalStore, getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	async function makeType() {
		if (name && description && type) {
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
			$modalStore[0].meta.boardDoc.Containers.push({
				ContainerName: name,
				ContainerDescription: description,
				ContainerType: type,
				ContainerValues: values
			});
			//construct the final obj
			const data = new FormData();
			data.append(
				'newData',
				JSON.stringify({
					BoardCreator: $modalStore[0].meta.boardDoc.BoardCreator,
					BoardName: $modalStore[0].meta.boardDoc.BoardName,
					Containers: $modalStore[0].meta.boardDoc.Containers,
					Description: $modalStore[0].meta.boardDoc.Description,
					Messages: $modalStore[0].meta.boardDoc.Messages
				})
			);
			updateDocument('DisscussionBoards', $modalStore[0].meta.boardDoc._id, data).then(
				(response) => {
					console.log(response);
					toastStore.trigger({
						message: 'Container created',
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

	let name: string;
	let description: string;
	const requiredField: PopupSettings = {
		event: 'hover',
		target: 'requiredField',
		placement: 'top'
	};
	let type: string;
</script>

<div class="bg-initial card p-4" data-popup="requiredField">
	<p>Required Field</p>
	<div class="bg-initial arrow" />
</div>

<div class="makeAssets card p-5 shadow-xl" id="makeTypePopup">
	<div class="card bg-modern-50 h-full p-5">
		<header class="h2 card-header text-center">Make a Container</header>
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
			<label for="assetType" class="formlabel text-center">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> What the container is
					holding:
				</p>
				<select id="assetType" class="select w-96" bind:value={type}>
					<option>Assets</option>
					<option>Users</option>
				</select>
			</label>
			<br />
			<label id="values" for="assetType" class="formlabel text-center">
				<p class="p-4 text-center">Values:</p>
				{#if type == 'Assets'}
					<InputAssociation
						list
						fieldName="Values"
						associationType="Asset"
						presavedAssociation={undefined}
						style="margin: 5px auto;"
					/>
				{:else}
					<InputAssociation
						list
						fieldName="Values"
						associationType="User"
						presavedAssociation={undefined}
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
				on:click|preventDefault={makeType}>Make Container</button
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
