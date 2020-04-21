import axios from axios

/*User adresse update*/
export default function UserAddressUpdate(id, pkg) {
    return axios.post("/api/users/updateAddress/" + id, pkg);
}