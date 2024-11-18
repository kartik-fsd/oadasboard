"use client";

import {
  RegistrationProvider,
  useRegistration,
} from "@/context/RegistrationContext";
import { AnimatePresence } from "framer-motion";
import { TaskerForm } from "./taskerForm";
import { SellerForm } from "./sellerForm";
import { ProductForm } from "./productForm";

const StepRenderer = () => {
  const { state } = useRegistration();

  switch (state.step) {
    case 0:
      return <TaskerForm />;
    case 1:
      return <SellerForm />;
    case 2:
      return <ProductForm />;
    default:
      return null;
  }
};

export function RegistrationContent() {
  return (
    <RegistrationProvider>
      <AnimatePresence mode="wait">
        <StepRenderer />
      </AnimatePresence>
    </RegistrationProvider>
  );
}
