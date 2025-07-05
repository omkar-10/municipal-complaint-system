// utils/dataUri.js
export const bufferToDataURI = (fileFormat, buffer) => {
  return `data:image/${fileFormat};base64,${buffer.toString("base64")}`;
};
