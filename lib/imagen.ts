const LADO = 512;

/** Recorta al cuadrado central y redimensiona a 512px antes de guardar — nunca subir el original. */
export function recortarYRedimensionar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const lado = Math.min(img.width, img.height);
      const sx = (img.width - lado) / 2;
      const sy = (img.height - lado) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = LADO;
      canvas.height = LADO;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('canvas no disponible'));
        return;
      }
      ctx.drawImage(img, sx, sy, lado, lado, 0, 0, LADO, LADO);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('no se pudo leer la imagen'));
    };
    img.src = url;
  });
}
