import axios from "axios";

async function getUserData() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/userInfo`,
            {withCredentials: true});
        return response.data;
    } catch (err) {
        if (err.response.status === 401) {
            return null;
        } else {
            throw err;
        }
    }
}

export default getUserData;