import imageCompression, { Options } from "browser-image-compression"

const options: Options = {
  maxSizeMB: 0.2,
  fileType: "image/webp",
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
