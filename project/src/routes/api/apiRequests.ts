
//remember to wrap these in onMount checks

export const fetchDocuments = (collectionName: string) => {
  return fetch('http://localhost:5038/api/get/collection/'+collectionName)
    .then((response) => { return response.json() })
    .then((data) => {
      return data;
    });
};

export const insertDocument = (collectionName: string, formData:any) => {
		return fetch('http://localhost:5038/api/insert/collection/'+collectionName, {
			method: 'POST',
			body: formData
		})
			.then((response) => { return response })
			.then((data) => {
				return data
			}).catch(err => { return err });
}

//update assets

export const updateDocuments = (collectionName : string, formData:any) => {
	return fetch('http://localhost:5038/api/update/'+collectionName,{
		method:'PUT',
		body: formData

	})
		.then((response) => { return response.json() })
		.then((data) => {
			return data
		});
}


// insertDocument('AssetType', typeObject)
		// 	.then(() => {
		// 		toastStore.trigger({
		// 			message: 'Type created',
		// 			background: 'variant-ghost-success',
		// 			timeout: 3000
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		toastStore.trigger({
		// 			message: 'The Type could not be created',
		// 			background: 'variant-ghost-error',
		// 			timeout: 3000
		// 		});
		// 		console.error(err);
		// 	});