import axios from "axios";

async function getFavorites(user) {
    if (user.favorites.length === 0) {
        return [];
    }
    let queryString = user.favorites[0];
    for (let i = 1; i < user.favorites.length; i++) {
        queryString = queryString + "/" + user.favorites[i];
    }

    try {
        const favorites = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/favorites/${queryString}`,
            {withCredentials: true});
        return favorites.data;
    } catch (error) {
        return [];
    }
}

export default getFavorites;