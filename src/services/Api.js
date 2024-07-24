import axios from "axios";

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_ENDPOINT,
    withCredentials: true
});

export default http;