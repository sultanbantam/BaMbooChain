import { Request, Response } from 'express';

const getUploadedFileType = (mimeType: string): 'image' | 'audio' | 'video' | 'document' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
};

export const uploadFile = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  // Construct URL for the uploaded file.
  // Since we serve the uploads directory statically at /uploads.
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({
    message: 'File uploaded successfully',
    url: fileUrl,
    type: getUploadedFileType(req.file.mimetype),
    fileName: req.file.originalname,
    size: req.file.size,
  });
};
