import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function compressAndUploadImage(
    base64Image: string,
    folder: string
): Promise<string> {
    // Remove data URL prefix
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Compress image using Sharp
    const compressedBuffer = await sharp(buffer)
        .webp({ quality: 80, lossless: true }) // Use lossless WebP compression
        .resize(1200, 1200, { // Maximum dimensions
            fit: 'inside',
            withoutEnlargement: true
        })
        .toBuffer();

    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileName,
            Body: compressedBuffer,
            ContentType: 'image/webp',
            ACL: 'public-read',
        },
    });

    await upload.done();

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
