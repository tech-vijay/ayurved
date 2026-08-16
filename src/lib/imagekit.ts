export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height?: number;
  width?: number;
  size?: number;
  filePath: string;
}

export interface ImageKitConfig {
  publicKey: string;
  urlEndpoint: string;
  privateKey?: string;
}

export function getImageKitConfig(): ImageKitConfig {
  const clean = (val?: string) => (val || '').replace(/^["']|["']$/g, '').trim();

  const publicKey = clean(import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
  const urlEndpoint = clean(import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT);
  const privateKey = clean(import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY);

  const isPlaceholder = (val: string) =>
    !val ||
    val.includes('your_imagekit_public_key') ||
    val.includes('your_imagekit_id') ||
    val.includes('your_imagekit_private_key');

  return {
    publicKey: isPlaceholder(publicKey) ? '' : publicKey,
    urlEndpoint: isPlaceholder(urlEndpoint) ? '' : urlEndpoint,
    privateKey: isPlaceholder(privateKey) ? '' : privateKey,
  };
}

/**
 * Generates an HMAC-SHA1 signature using browser Web Crypto API
 * for authenticating direct client-side uploads to ImageKit.
 */
export async function generateSignature(
  token: string,
  expire: string,
  privateKey: string
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(privateKey);
  const messageData = encoder.encode(token + expire);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Uploads a file directly to ImageKit CDN.
 */
export async function uploadToImageKit(
  file: File | string,
  fileName?: string,
  folder: string = '/ayurved/medicines'
): Promise<ImageKitUploadResponse> {
  const config = getImageKitConfig();

  if (!config.publicKey || !config.urlEndpoint) {
    throw new Error(
      'ImageKit keys are missing or invalid in .env file. Please add your real VITE_IMAGEKIT_PUBLIC_KEY and VITE_IMAGEKIT_URL_ENDPOINT.'
    );
  }

  const expire = Math.floor(Date.now() / 1000 + 1800).toString();
  const token = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2) + Date.now().toString(36);

  const signature = config.privateKey
    ? await generateSignature(token, expire, config.privateKey)
    : '';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName || (file instanceof File ? file.name : `image_${Date.now()}`));
  formData.append('publicKey', config.publicKey);
  formData.append('folder', folder);
  formData.append('useUniqueFileName', 'true');

  if (signature) {
    formData.append('signature', signature);
    formData.append('expire', expire);
    formData.append('token', token);
  }

  const headers: Record<string, string> = {};
  if (config.privateKey) {
    headers['Authorization'] = `Basic ${btoa(config.privateKey + ':')}`;
  }

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `ImageKit Upload failed (${response.status})`);
  }

  const result: ImageKitUploadResponse = await response.json();
  return result;
}

/**
 * Formats an ImageKit image URL with dynamic transformation options.
 */
export function getImageKitUrl(
  imagePathOrUrl: string | null | undefined,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: string;
    focus?: string;
  }
): string {
  if (!imagePathOrUrl) return '';

  if (!transformations) return imagePathOrUrl;

  const trParts: string[] = [];
  if (transformations.width) trParts.push(`w-${transformations.width}`);
  if (transformations.height) trParts.push(`h-${transformations.height}`);
  if (transformations.quality) trParts.push(`q-${transformations.quality}`);
  if (transformations.crop) trParts.push(`c-${transformations.crop}`);
  if (transformations.focus) trParts.push(`fo-${transformations.focus}`);

  if (trParts.length === 0) return imagePathOrUrl;

  const trString = `tr=${trParts.join(',')}`;

  if (imagePathOrUrl.includes('ik.imagekit.io')) {
    const separator = imagePathOrUrl.includes('?') ? '&' : '?';
    return `${imagePathOrUrl}${separator}${trString}`;
  }

  return imagePathOrUrl;
}
