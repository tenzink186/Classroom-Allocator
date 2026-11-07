
const CLOUD_NAME = "zwfxxtau";
const UPLOAD_PRESET = "ClassFind";

export async function uploadProfilePicture(image) {
  if (!image?.base64) {
    throw new Error(
      "Image data is missing. Please select the picture again."
    );
  }

  if (image.fileSize && image.fileSize > 5 * 1024 * 1024) {
    throw new Error("Please select an image smaller than 5 MB.");
  }

  const mimeType = image.mimeType || "image/jpeg";
  const dataUri = `data:${mimeType};base64,${image.base64}`;

  const formData = new FormData();

  // Cloudinary accepts a Base64 data URI as the file field.
  formData.append("file", dataUri);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error?.message || "Cloudinary upload failed."
    );
  }

  if (!result.secure_url) {
    throw new Error("Cloudinary did not return an image URL.");
  }

  return result.secure_url;
}
