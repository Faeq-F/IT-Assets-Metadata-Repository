<script>
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<AppBar
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
	class="header sticky"
>
	<svelte:fragment slot="lead">
		<strong class="text-xl uppercase">Asset Application</strong>
	</svelte:fragment>

	<svelte:fragment slot="trail">
		<LightSwitch />
		<a class="variant-ghost-surface btn btn-sm" href="/home" rel="noreferrer"> Home </a>
		<a class="variant-ghost-surface btn btn-sm" href="/assets" rel="noreferrer"> Assets </a>
		<a class="variant-ghost-surface btn btn-sm" href="/types" rel="noreferrer"> Types </a>

		<a href="/profile" rel="noreferrer"><i class="fa-solid fa-circle-user text-3xl"></i></a>
	</svelte:fragment>
</AppBar>
