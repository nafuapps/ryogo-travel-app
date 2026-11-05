import imageCompression, { Options } from "browser-image-compression"

const UPLOAD_COMPRESS_IMAGE_MAX_SIZE = 50000 //50kb
const FAILED_COMPRESS_IMAGE_MAX_SIZE = 500000 //500kb

const options: Options = {
  maxSizeMB: UPLOAD_COMPRESS_IMAGE_MAX_SIZE / 1000000, //Max file size after compression (in mb)
  fileType: "image/webp", //Target file type
  alwaysKeepResolution: true, // optional, only reduce quality, always keep width and height (default: false)
}

export default async function compressImage(file?: FileList) {
  if (!file || !file[0]) return
  if (file[0].size < UPLOAD_COMPRESS_IMAGE_MAX_SIZE) return file[0]
  try {
    const compressedImage = await imageCompression(file[0], options)
    return compressedImage
  } catch {
    //If compression failed and file size is too large, don't upload the image
    if (file[0].size > FAILED_COMPRESS_IMAGE_MAX_SIZE) {
      console.error(
        "Image compression failed and file size is too large",
        file[0].type,
        file[0].size,
      )
      return
    }
    return file[0]
  }
}
