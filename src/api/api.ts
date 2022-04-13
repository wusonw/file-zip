import router from "@/router";
import { notification } from "ant-design-vue";
import axios from "axios";

axios.interceptors.response.use((res) => {
  try {
    if (res.data.code !== 0) {
      if (res.data.code === 40300) {
        router.push("/login");
        return {};
      }
      notification.error({ type: "error", message: res.data.message });
      return {};
    }
    return res.data.data;
  } catch (e: any) {
    notification.error({ type: "error", message: res.data.message });
    return {};
  }
});

const baseURL = "http://localhost:3000";
axios.defaults.maxContentLength = Infinity;
axios.defaults.maxBodyLength = Infinity;

export const _get = async (url: string, params: any = {}, body = {}) => {
  return await axios({
    baseURL,
    timeout: 0,
    method: "GET",
    url,
    params,
    data: body,
  });
};

export const _post = async (url: string, body: any = {}) => {
  return await axios({
    baseURL,
    timeout: 0,
    method: "POST",
    url,
    data: body,
  });
};
//token
export const CHECK_TOKEN = async () => {
  const userid = window.localStorage.getItem("userId") || "";
  const token = window.localStorage.getItem("token") || "";
  return axios({
    baseURL,
    timeout: 0,
    method: "GET",
    url: "/token/",
    headers: {
      userid,
      token,
    },
  });
};

// user
export const USER_REGISTER = async (data: any) => _post("/user/", data);
export const USER_LOGIN = async (data: any) => _post("/user/login", data);

//email
export const SEND_CHECK_CODE = async (data: any) => _post("/email/", data);

//share
export const SHARE_FILE = async (data: any) => {
  const userid = window.localStorage.getItem("userId") || "";
  const token = window.localStorage.getItem("token") || "";
  return await axios({
    baseURL,
    timeout: 0,
    method: "POST",
    url: "/share/",
    headers: {
      userid,
      token,
    },
  });
};

export const GET_SHARE_FILE = async (data: any) => _post("/share/file", data);
