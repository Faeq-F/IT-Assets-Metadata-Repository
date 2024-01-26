<script>
	import NavBar from '../NavBar.svelte';
</script>

<div class="app">
	<NavBar />

	<main>
		<slot />
	</main>

	<footer></footer>
</div>

<style>
</style>
