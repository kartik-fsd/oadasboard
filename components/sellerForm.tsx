"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { useImageCapture } from "@/hooks/useImageCapture";
import { useRegistration } from "@/context/RegistrationContext";
import { motion } from "framer-motion";
import { UserCircle, Phone, Camera, Store } from "lucide-react";

export const SellerForm = () => {
  const { state, dispatch } = useRegistration();
  const { captureImage, isCapturing } = useImageCapture();
  const { sellerDetails } = state;

  const formatPhoneNumber = (input: string) => {
    if (!input) return "";
    const cleaned = input.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return (
        match[1] +
        (match[2] ? "-" + match[2] : "") +
        (match[3] ? "-" + match[3] : "")
      );
    }
    return input;
  };

  const isSellerFormValid = () => {
    const phoneDigits =
      sellerDetails?.sellerPhoneNumber?.replace(/\D/g, "") || "";
    const gstLength = sellerDetails?.gstNumber?.length || 0;
    const nameLength = sellerDetails?.sellerName?.trim().length || 0;

    return (
      nameLength > 0 &&
      phoneDigits.length === 10 &&
      gstLength === 15 &&
      !!sellerDetails?.shopImage
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSellerFormValid()) {
      dispatch({ type: "SET_STEP", payload: 2 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
            <Store className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            Seller Details
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Seller Name */}
            <div className="space-y-2">
              <Label htmlFor="sellerName">Seller Name</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="sellerName"
                  placeholder="Enter seller name"
                  value={sellerDetails?.sellerName || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_SELLER",
                      payload: { sellerName: e.target.value },
                    })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Seller Phone */}
            <div className="space-y-2">
              <Label htmlFor="sellerPhoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="sellerPhoneNumber"
                  placeholder="123-456-7890"
                  value={sellerDetails?.sellerPhoneNumber || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_SELLER",
                      payload: {
                        sellerPhoneNumber: formatPhoneNumber(e.target.value),
                      },
                    })
                  }
                  className="pl-10"
                  required
                />
              </div>
              {sellerDetails?.sellerPhoneNumber &&
                sellerDetails.sellerPhoneNumber.replace(/\D/g, "").length !==
                  10 && (
                  <p className="text-sm text-red-500">
                    Please enter a valid 10-digit phone number
                  </p>
                )}
            </div>

            {/* GST Number */}
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                placeholder="15-digit GST Number"
                value={sellerDetails?.gstNumber || ""}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_SELLER",
                    payload: { gstNumber: e.target.value.toUpperCase() },
                  })
                }
                maxLength={15}
                className="uppercase"
                required
              />
              {sellerDetails?.gstNumber &&
                sellerDetails.gstNumber.length !== 15 && (
                  <p className="text-sm text-red-500">
                    GST number must be exactly 15 characters
                  </p>
                )}
            </div>

            {/* Shop Image */}
            <div className="space-y-2">
              <Label>Shop Image</Label>
              <div className="flex flex-col items-center gap-4">
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      const image = await captureImage();
                      if (image) {
                        dispatch({
                          type: "UPDATE_SELLER",
                          payload: { shopImage: image },
                        });
                      }
                    } catch (error) {
                      console.error("Image capture failed:", error);
                    }
                  }}
                  disabled={isCapturing}
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {sellerDetails?.shopImage
                    ? "Retake Shop Photo"
                    : "Take Shop Photo"}
                </Button>
                {sellerDetails?.shopImage && (
                  <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={sellerDetails.shopImage}
                      alt="Shop"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch({ type: "SET_STEP", payload: 0 })}
              className="w-full sm:w-1/2"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={!isSellerFormValid()}
              className="w-full sm:w-1/2"
            >
              Next: Add Products
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};
