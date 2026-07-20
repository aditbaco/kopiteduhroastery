// The storage boundary. `save` returns exactly the string persisted in
// Product.heroImage, and `remove` accepts that same string — so the domain
// layer never learns whether it is a local path or a remote URL. Swapping in
// S3 later means one new implementation and one line in ./index.ts.

export type UploadedImage = {
  buffer: Buffer
  mimeType: string
}

export type ImageStorage = {
  save: (file: UploadedImage) => Promise<string>
  remove: (storedValue: string | null) => Promise<void>
}
