<svelte:head>
	<title>Assets</title>
</svelte:head>

<script>
	function makeAsset(){
		alert('unfinished');
	}
</script>

<h1>Assets page</h1>
<div class="makeAssets">
	<header> Make Assets</header>
	<button id="assetMaker" on:click={makeAsset}> Make Asset</button>
</div>

<p id="bottom">Something at the bottom to see navbar animation work</p>

<style>
	@import url('$lib/styles/root.css');

	h1 {
		text-align: center;
		margin-top: 15vh;
	}
	#bottom {
		margin-top: 150vh;
	}
	.makeAssets{
		border: 5px outset red;
		background-color: lightblue;
		text-align:center;
		width: 50%;	
		margin-left: 25%;
	}	
</style>