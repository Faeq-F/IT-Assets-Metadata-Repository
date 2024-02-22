
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

export const deleteDocument = (collectionName: string, documentID: string) => {
	return fetch('http://localhost:5038/api/delete/collection/'+collectionName+"/document/"+documentID, {
		method: 'DELETE',
	})
	.then((response) => { return response })
	.then((data) => {
		return data
	}).catch(err => { return err });
}


//

export const updateDocument = (collectionName : string, id: string, formData:any) => {
	return fetch('http://localhost:5038/api/update/collection/'+collectionName+"/document/"+id,{
		method:'PUT',
		body: formData

	})
		.then((response) => { return response.json() })
		.then((data) => {
			return data
		}).catch(err => {
			err.id;
			//Catching all exceptions since redundant exception is thrown when update works
		});
}
