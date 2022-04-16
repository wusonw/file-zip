export const getFileSize = (size: number) => {
  if (!size) return "";

  const num = 1024.0; //byte

  if (size < num) return size + "B";
  if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "K"; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
  return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
};

export const formatTime = (time: string) => {
  const date = new Date(Number(time))
  const Y = date.getFullYear().toString()
  const M = date.getMonth() + 1
  const D = date.getDate()
  const HH = date.getHours()
  const MM = date.getMinutes()
  const SS = date.getSeconds()

  return `${Y}-${M >= 10 ? M : `0${M}`}-${D >= 10 ? D : `0${D}`} ${HH >= 10 ? HH : `0${HH}`}:${MM >= 10 ? MM : `0${MM}`}:${SS >= 10 ? SS : `0${SS}`}`
}

