"use client"
import { useState } from "react";

export const useImageCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureImage = async (): Promise<string> => {
    setIsCapturing(true);
    try {
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.capture = "environment";

        input.onchange = (e: Event) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
              setIsCapturing(false);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      });
    } catch (error) {
      setIsCapturing(false);
      throw error;
    }
  };

  return { captureImage, isCapturing };
};
