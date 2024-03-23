<script lang="ts">
	import {
		AppBar,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import MakeContainer from './MakeContainer.svelte';

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: MakeContainer };
	const makeModal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};

	export let boardDoc: any;
	let collapsed = false;
</script>

<div class="card bg-modern-50 w-11/12 p-4 drop-shadow-md" style="margin: 0 auto">
	<AppBar background="transparent">
		<svelte:fragment slot="lead">
			<button on:click={() => (collapsed = !collapsed)}>
				{#if collapsed}
					<i class="fa-solid fa-angle-up"></i>
				{:else}
					<i class="fa-solid fa-angle-down"></i>
				{/if}
			</button>
			{#if boardDoc.Containers.length > 0}
				<p id="nothingHere" class="ml-2">Containers:</p>
			{:else}
				<p id="nothingHere" class="ml-2">
					This discussion has no containers, click the <i class="fa-solid fa-plus"></i>
					to add one
				</p>
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="trail">
			<button
				id="containerMaker"
				class="card card-hover border-modern-500 bg-modern-50 border-2 drop-shadow-md"
				on:click={() => modalStore.trigger(makeModal)}><i class="fa-solid fa-plus"></i></button
			>
		</svelte:fragment>
	</AppBar>
</div>

<style>
	#containerMaker {
		width: 2vw;
		height: 2vw;
		padding: 0;
		float: right;
	}
</style>
