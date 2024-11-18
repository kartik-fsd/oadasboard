"use client";

import { useState } from 'react';
import { RegistrationState } from '@/types/registration';
import { useToast } from "@/hooks/use-toast";

export const useRegistrationSubmit = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockApiCall = async (data: any): Promise<any> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            success: true,
            data: {
                id: 'seller_' + Math.random().toString(36).substr(2, 9),
                ...data
            }
        };
    };

    const submitRegistration = async (data: RegistrationState) => {
        setIsSubmitting(true);
        try {
            console.group('Registration Submission');
            console.log('Tasker Details:', data.taskerDetails);
            console.log('Seller Details:', data.sellerDetails);
            console.log('Products:', data.products);
            console.groupEnd();

            // Mock API call
            const response = await mockApiCall(data);

            if (response.success) {
                toast({
                    title: "Registration Successful! 🎉",
                    description: `Submitted ${data.products.length} products for seller ${data.sellerDetails.sellerName}`,
                    variant: "success"
                });

                // Additional success toasts to show what would happen in production
                toast({
                    title: "Verification Email Sent",
                    description: "Please check your email for verification.",
                    variant: "info"
                });

                toast({
                    title: "Next Steps",
                    description: "Our team will review your submission within 24-48 hours.",
                    variant: "info"
                });

                return response.data;
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast({
                title: "Registration Failed",
                description: "There was an error submitting your registration. Please try again.",
                variant: "destructive"
            });
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submitRegistration, isSubmitting };
};