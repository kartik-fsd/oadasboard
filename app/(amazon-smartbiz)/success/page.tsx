"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RegistrationSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Registration Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Thank you for registering. Our team will review your submission and
            get back to you within 24-48 hours.
          </p>
          <Button className="w-full" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
