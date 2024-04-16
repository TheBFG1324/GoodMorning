import axios from 'axios';

const baseURL = 'http://.18.222.95.223:3000'; // Change this if your backend server runs on a different URL
const axiosInstance = axios.create({
    baseURL,
});

export default axiosInstance;
