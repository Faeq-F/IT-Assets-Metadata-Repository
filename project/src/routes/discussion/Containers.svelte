<script lang="ts">
	import {
		AppBar,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import MakeContainer from './MakeContainer.svelte';
	import Container from './Container.svelte';

	export let boardDoc: any;

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: MakeContainer };
	const makeModal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		meta: { boardDoc: boardDoc }
	};
</script>

<AppBar background="transparent">
	<svelte:fragment slot="lead">
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

<div id="ContainersContainer">
	{#each boardDoc.Containers as container}
		<Container {container} />
	{/each}
</div>

<style>
	#containerMaker {
		width: 2vw;
		height: 2vw;
		padding: 0;
		float: right;
	}

	#ContainersContainer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: stretch;
		width: 90%;
		margin: 10px auto;
	}
</style>
