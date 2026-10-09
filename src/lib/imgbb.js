export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    { method: "POST", body: formData }
  );
  const json = await res.json();

  if (!json.success) throw new Error("Image upload failed");
  return json.data.display_url;
}