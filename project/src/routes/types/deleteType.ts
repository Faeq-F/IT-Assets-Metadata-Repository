import { deleteDocument } from "../api/apiRequests"
import { injectTypeDivs } from "./typeDivInjection";

export function deleteAssetType(id: string | undefined) {
  if (id != undefined) {
    deleteDocument("AssetType", id).then((result) => { console.log(result);injectTypeDivs(); }).catch(err => console.log(err));
  }
}