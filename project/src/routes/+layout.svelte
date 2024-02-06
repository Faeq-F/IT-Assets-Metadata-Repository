<script>
	import { page } from '$app/stores';
	import NavBar from './NavBar.svelte';
</script>

<div class="app">
	{#if $page.url.pathname != '/'}
		<NavBar />
	{/if}

	<main>
		<slot />
	</main>

	<footer></footer>
</div>

<style>
</style>
