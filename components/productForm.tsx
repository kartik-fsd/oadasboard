import { useRegistration } from "@/context/RegistrationContext";
import { useImageCapture } from "@/hooks/useImageCapture";
import { Product } from "@/types/registration";
import { motion } from "framer-motion";
import { Camera, Loader2, Trash2 } from "lucide-react";
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
import { useRegistrationSubmit } from "@/hooks/useRegistartionSubmit";
import { useRouter } from "next/navigation";

export const ProductForm = () => {
  const { state, dispatch } = useRegistration();
  const { captureImage, isCapturing } = useImageCapture();
  const { products, currentProduct } = state;
  const { submitRegistration, isSubmitting } = useRegistrationSubmit();
  const router = useRouter();

  const handleImageCapture = async (
    field: keyof Pick<Product, "image1" | "image2" | "image3">
  ) => {
    try {
      const image = await captureImage();
      dispatch({
        type: "UPDATE_CURRENT_PRODUCT",
        payload: { [field]: image },
      });
    } catch (error) {
      console.error("Image capture failed:", error);
    }
  };
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProductValid()) {
      dispatch({ type: "ADD_PRODUCT" });
    }
  };

  const isProductValid = () => {
    return (
      currentProduct.name &&
      currentProduct.image1 &&
      currentProduct.image2 &&
      currentProduct.image3 &&
      parseFloat(currentProduct.mrp) > 0 &&
      parseFloat(currentProduct.msp) > 0 &&
      parseFloat(currentProduct.msp) <= parseFloat(currentProduct.mrp)
    );
  };

  const handleRegistrationSubmit = async () => {
    if (products.length >= 3) {
      try {
        await submitRegistration(state);
        // Optional: Navigate to success page or reset form
        router.push("/success"); // If you want to navigate
        // Or reset the form:
        // dispatch({ type: 'RESET_FORM' });
      } catch (error) {
        // Error is handled in useRegistrationSubmit
        console.error("Submission failed:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            Add Product ({products.length} / 200)
          </CardTitle>
          {products.length >= 3 && (
            <p className="text-sm text-center text-green-600">
              Minimum requirement met! You can submit or add more products.
            </p>
          )}
        </CardHeader>
        <form onSubmit={handleProductSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                  value={currentProduct.name}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_CURRENT_PRODUCT",
                      payload: { name: e.target.value },
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="grid grid-cols-1 gap-4">
                  {(["image1", "image2", "image3"] as const).map(
                    (field, index) => (
                      <div key={field} className="space-y-2">
                        <p className="text-sm text-gray-500">
                          Image {index + 1}
                        </p>
                        <div className="flex flex-col gap-2">
                          {currentProduct[field] ? (
                            <div className="relative w-full aspect-video">
                              <Image
                                src={currentProduct[field]}
                                alt={`Product Image ${index + 1}`}
                                fill
                                className="rounded-lg object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() =>
                                  dispatch({
                                    type: "UPDATE_CURRENT_PRODUCT",
                                    payload: { [field]: "" },
                                  })
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => handleImageCapture(field)}
                              disabled={isCapturing}
                              className="w-full"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              Take Photo {index + 1}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mrp">MRP (₹)</Label>
                  <Input
                    id="mrp"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentProduct.mrp}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_CURRENT_PRODUCT",
                        payload: { mrp: e.target.value },
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="msp">MSP (₹)</Label>
                  <Input
                    id="msp"
                    type="number"
                    step="0.01"
                    min="0"
                    max={currentProduct.mrp}
                    value={currentProduct.msp}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_CURRENT_PRODUCT",
                        payload: { msp: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row w-full gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
                className="w-full sm:w-1/3"
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={
                  !isProductValid() || products.length >= 200 || isSubmitting
                }
                className="w-full sm:w-2/3"
              >
                Add Product
              </Button>
            </div>

            {products.length >= 3 && (
              <Button
                type="button"
                variant="default"
                className="w-full"
                onClick={handleRegistrationSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  `Submit Registration (${products.length} products)`
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {products.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Added Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product, index) => (
                <Card key={index} className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-500">
                        MRP: ₹{product.mrp} | MSP: ₹{product.msp}
                      </p>
                    </div>
                    <div className="flex sm:flex-col gap-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_PRODUCT",
                            payload: index,
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
