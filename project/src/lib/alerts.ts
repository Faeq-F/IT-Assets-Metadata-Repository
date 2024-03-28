function emptyFieldAlert(toastStore: any) {
	toastStore.trigger({
		message: 'Please fill in all of the fields',
		background: 'variant-ghost-error',
		timeout: 3000
	});
}
