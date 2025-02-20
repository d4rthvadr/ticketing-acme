
import axios from "axios";

const signupUserRequest = async (email, password) => {
    return axios.post("/api/users/signup", {
        email,
        password
    });

}
