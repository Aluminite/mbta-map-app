import {jwtDecode} from 'jwt-decode'

const getUserInfo = () => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) return undefined
    return jwtDecode(accessToken)
}

export default getUserInfo