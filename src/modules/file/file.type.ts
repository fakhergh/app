class BaseUpload {
  assetId: string;
  folder: string;
  filename: string;
  url: string;
  size: number;
  extension: string;
  etag: string;
}

export class CreateImageDto extends BaseUpload {
  width: number;
  height: number;
}

export class CreateAudioDto extends BaseUpload {
  duration: number;
  codec: string;
  bitRate: number;
  frequency: number;
  channels: number;
  channelLayout: number;
}

export class CreateVideoDto extends BaseUpload {
  width: number;
  height: number;
  duration: number;
  codec: string;
  frameRate: number;
  bitRate: number;
}
