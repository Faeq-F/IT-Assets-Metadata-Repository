import { fetchDocuments } from '../api/apiRequests';

export function injectFilterDivs(): Promise<boolean> {
	return fetchDocuments('Asset').then((assetDocuments) => {
		const typeFilter = document.getElementsByClassName('typeFilter')[0];
		typeFilter.innerHTML = '';
		if (assetDocuments.length > 0) {
            
			var child = document.createElement('someuniquetag');
            child.innerHTML = 
            '<h1 class="h1">Filters</h1>'+
            '<div class="card" id="filters">' +
                '<ListBox multiple >'
                
            typeFilter.appendChild(child);

			for (let i of assetDocuments) {
				child.innerHTML =
                        '<ListBoxItem bind:group={activeFilters} name="medium" value="Library" >' + i.assetType + '</ListBoxItem>' +
                        '</ListBox>' +
                    '</div>'

                    typeFilter.appendChild(child);

				child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
			}
            child.innerHTML = 
                   '</ListBox>' +
               '</div>' +
               '<style>'+
               "@import url('$lib/styles/root.css');"+
               '#filters {'+
                   'margin-left: 25%;'+
                   'margin-right: 25%;'+
               '}'+
               '.h1 {'+
                   'text-align: center;'+
                   'margin-top: 15%;'+
                   'margin-bottom: 5%;'+
               '}'+
           '</style>'
            typeFilter.appendChild(child);
			return true;
		}
		return false;
	});
}





