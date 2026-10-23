import imageCompression, { Options } from "browser-image-compression"

const options: Options = {
  maxSizeMB: 0.2, //Max file size after compression should be 200kb
  fileType: "image/webp", //Target file type
  alwaysKeepResolution: true, // optional, only reduce quality, always keep width and height (default: false)
}

export default async function compressImage(file?: FileList) {
  if (!file || !file[0]) return
  try {
    const compressedImage = await imageCompression(file[0], options)
    return compressedImage
  } catch {
    return file[0]
  }
}
