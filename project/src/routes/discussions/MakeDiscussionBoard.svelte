<script lang="ts">
	import { getToastStore, popup } from '@skeletonlabs/skeleton';
	import RequiredField from '$lib/components/cards/RequiredField.svelte';
	import { requiredField } from '$lib/components/cards/RequiredField';
	import { makeBoard } from './DiscussionBoard';

	let boardName: string;
	let description: string;
	const toastStore = getToastStore();
</script>

<RequiredField />

<div class="makeBoard card p-5 shadow-xl">
	<div class="card h-full bg-modern-50 p-5">
		<header class="h2 card-header text-center">Make a Discussion Board</header>
		<br /><br />
		<form id="rootForm" class="text-center">
			<label for="boardName" class="formlabel">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Board Name:
				</p>
				<input
					type="text"
					id="boardName"
					name="boardName"
					placeholder="Enter Board Name"
					data-focusindex="0"
					class="input w-96"
					bind:value={boardName}
				/>
			</label>
			<br />
			<label for="Description" class="formlabel">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Description:
				</p>
				<textarea
					id="Description"
					name="Description"
					placeholder="Enter Description"
					data-focusindex="0"
					class="input w-9/12 rounded-2xl"
					style="resize: both; overflow:auto;"
					rows="9"
					bind:value={description}
				/>
			</label>
			<br />

			<br />
			<button
				class="variant-filled-primary btn w-52"
				style="margin: 0 auto; display:block;"
				id="assetMaker"
				on:click|preventDefault={() => makeBoard(boardName, description, toastStore)}
				>Make discussion board</button
			>
		</form>
	</div>
</div>

<style>
	.makeBoard {
		height: 70vh;
		width: 70vw;
	}

	#rootForm {
		height: 75%;
		overflow-y: scroll;
	}
</style>
