// Sube un archivo a Cloudinary (unsigned upload) y devuelve la URL segura.
//
// El código original hacía `const data = await res.json(); ...data.secure_url`
// sin comprobar si la subida realmente funcionó. Si Cloudinary devolvía un
// error (archivo muy pesado, formato no soportado como HEIC, límite de la
// cuenta, red inestable, etc.) `data.secure_url` quedaba `undefined` y ese
// `undefined` se guardaba igual en el estado de imágenes — sin avisar nada
// en el momento. El problema solo se notaba mucho después, al guardar el
// producto, como un error confuso y desconectado de su causa real.
//
// Aquí lanzamos un error explícito si la subida falla, para que quien
// llame pueda mostrar un aviso inmediato y no arrastrar datos corruptos.
export async function subirArchivoCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  let res;
  try {
    res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );
  } catch {
    throw new Error(`No se pudo subir "${file.name}" (problema de red). Intenta de nuevo.`);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.secure_url) {
    const detalle = data?.error?.message || `HTTP ${res.status}`;
    throw new Error(`No se pudo subir "${file.name}": ${detalle}`);
  }

  return data.secure_url;
}
