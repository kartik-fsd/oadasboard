import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compressAndUploadImage } from '@/lib/s3';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

type TransactionClient = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

// Validation schemas
const TaskerSchema = z.object({
    name: z.string().min(1),
    phone: z.string().regex(/^\d{10}$/)
});

const SellerSchema = z.object({
    name: z.string().min(1),
    phoneNumber: z.string().regex(/^\d{10}$/),
    gstNumber: z.string().length(15),
    shopImage: z.string().startsWith('data:image/')
});

const ProductSchema = z.object({
    name: z.string().min(1),
    image1: z.string().startsWith('data:image/'),
    image2: z.string().startsWith('data:image/'),
    image3: z.string().startsWith('data:image/'),
    mrp: z.string().transform(Number),
    msp: z.string().transform(Number)
});

const RegistrationSchema = z.object({
    taskerDetails: TaskerSchema,
    sellerDetails: SellerSchema,
    products: z.array(ProductSchema).min(30).max(200)
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate request body
        const validatedData = RegistrationSchema.parse(body);

        // Start a transaction
        return await prisma.$transaction(async (tx: TransactionClient) => {
            // 1. Find or create tasker
            const tasker = await tx.tasker.upsert({
                where: { phone: validatedData.taskerDetails.phone },
                update: {},
                create: {
                    name: validatedData.taskerDetails.name,
                    phone: validatedData.taskerDetails.phone,
                },
            });

            // 2. Upload shop image
            const shopImageUrl = await compressAndUploadImage(
                validatedData.sellerDetails.shopImage,
                'shop-images'
            );

            // 3. Create seller
            const seller = await tx.seller.create({
                data: {
                    name: validatedData.sellerDetails.name,
                    phoneNumber: validatedData.sellerDetails.phoneNumber,
                    gstNumber: validatedData.sellerDetails.gstNumber,
                    shopImage: shopImageUrl,
                },
            });

            // 4. Create collection record
            await tx.collection.create({
                data: {
                    taskerId: tasker.id,
                    sellerId: seller.id,
                },
            });

            // 5. Upload product images and create products
            const productPromises = validatedData.products.map(async (product) => {
                const [image1Url, image2Url, image3Url] = await Promise.all([
                    compressAndUploadImage(product.image1, 'product-images'),
                    compressAndUploadImage(product.image2, 'product-images'),
                    compressAndUploadImage(product.image3, 'product-images'),
                ]);

                return tx.product.create({
                    data: {
                        sellerId: seller.id,
                        name: product.name,
                        image1: image1Url,
                        image2: image2Url,
                        image3: image3Url,
                        mrp: product.mrp,
                        msp: product.msp,
                    },
                });
            });

            // Wait for all products to be created
            await Promise.all(productPromises);

            return NextResponse.json({
                success: true,
                data: {
                    taskerId: tasker.id,
                    sellerId: seller.id,
                    message: 'Registration completed successfully',
                },
            }, { status: 201 });
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                errors: error.issues,
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            error: 'Internal server error',
        }, { status: 500 });
    }
}