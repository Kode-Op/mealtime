import axios from axios

/*User phone number update*/
export default function UserPhoneNumberUpdate(id, pkg) {
    return axios.post("/api/users/updatePhone/" + id, pkg)
}