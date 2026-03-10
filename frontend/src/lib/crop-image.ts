import type { Area } from "react-easy-crop";

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Area,
  options: { circle?: boolean } = {}
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  if (options.circle) {
    const circleCanvas = document.createElement("canvas");
    const circleCtx = circleCanvas.getContext("2d");

    if (!circleCtx) {
      throw new Error("Unable to create circle canvas context");
    }

    const size = Math.min(pixelCrop.width, pixelCrop.height);
    circleCanvas.width = size;
    circleCanvas.height = size;

    circleCtx.beginPath();
    circleCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    circleCtx.closePath();
    circleCtx.clip();

    circleCtx.drawImage(
      canvas,
      (pixelCrop.width - size) / 2,
      (pixelCrop.height - size) / 2,
      size,
      size,
      0,
      0,
      size,
      size
    );

    return circleCanvas.toDataURL("image/png");
  }

  return canvas.toDataURL("image/png");
}
