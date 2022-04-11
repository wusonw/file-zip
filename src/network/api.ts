import request from "./request";

export const signIn = (
  email: string,
  checkCode: number,
  password: string,
  nickName: string
) => {
  return request.post("/user/", {
    email,
    checkCode,
    password,
    nickName,
  });
};

// 用户登录
export const signUp = (email: string, password: string) => {
  return request.post("/user/", {
    email,
    password,
  });
};

export const shareFile = (
  shareId: string,
  action: string,
  fileName: string,
  fileData: string,
  password: string,
  downloadTimes: number
) => {
  return request.post("/share/", {
    shareId,
    action,
    fileName,
    fileData,
    password,
    downloadTimes,
  });
};
