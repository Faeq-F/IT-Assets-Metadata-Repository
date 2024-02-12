
//remember to wrap these in onMount checks

export const fetchDocuments = (collectionName: string) => {
    return fetch('http://localhost:5038/api/get/collection/'+collectionName)
      .then((response) => { return response.json() })
      .then((data) => {
        return data;
      });
};