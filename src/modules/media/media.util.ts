import { UploadApiResponse } from 'cloudinary';

export const MAX_WIDTH = 1920;

export const MAX_HEIGHT = 1080;

export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'audio/aac',
  'audio/mp3',
  'video/mp4',
  'video/avi',
  'application/pdf',
  'application/msword', //doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //docx
];

export function getImageMetadataFromCloudinaryResponse(data: UploadApiResponse, extension?: string) {
  return {
    assetId: data.asset_id,
    folder: data.folder,
    filename: data.public_id,
    url: data.secure_url,
    size: data.bytes,
    extension: data.format ?? extension,
    width: data.width,
    height: data.height,
    etag: data.etag,
    data,
  };
}

export function getAudioMetadataFromCloudinaryResponse(data: UploadApiResponse, extension?: string) {
  return {
    assetId: data.asset_id,
    folder: data.folder,
    filename: data.public_id,
    url: data.secure_url,
    size: data.bytes,
    extension: data.format ?? extension,
    duration: data.duration,
    bitRate: data.audio.bit_rate,
    codec: data.audio.codec,
    etag: data.etag,
    channels: data.audio.channels,
    channelLayout: data.audio.channel_layout,
    frequency: data.audio.frequency,
    data,
  };
}

export function getVideoMetadataFromCloudinaryResponse(data: UploadApiResponse, extension?: string) {
  return {
    assetId: data.asset_id,
    folder: data.folder,
    filename: data.public_id,
    url: data.secure_url,
    size: data.bytes,
    extension: data.format ?? extension,
    width: data.width,
    height: data.height,
    duration: data.duration,
    frameRate: data.frame_rate,
    bitRate: data.video.bit_rate,
    codec: data.video.codec,
    etag: data.etag,
    data,
  };
}

export function getDocumentMetadataFromCloudinaryResponse(data: UploadApiResponse, extension?: string) {
  return {
    assetId: data.asset_id,
    folder: data.folder,
    filename: data.public_id,
    url: data.secure_url,
    size: data.bytes,
    extension: data.format ?? extension,
    etag: data.etag,
    data,
  };
}
