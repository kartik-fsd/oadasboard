"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";
import { RegistrationState, RegistrationAction } from "@/types/registration";

const initialState: RegistrationState = {
  step: 0,
  taskerDetails: {
    name: "",
    phone: "",
  },
  sellerDetails: {
    sellerName: "",
    sellerPhoneNumber: "",
    gstNumber: "",
    shopImage: null,
  },
  products: [],
  currentProduct: {
    name: "",
    image1: "",
    image2: "",
    image3: "",
    mrp: "",
    msp: "",
  },
};

const RegistrationContext = createContext<
  | {
      state: RegistrationState;
      dispatch: React.Dispatch<RegistrationAction>;
    }
  | undefined
>(undefined);

export const registrationReducer = (
  state: RegistrationState,
  action: RegistrationAction
): RegistrationState => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "UPDATE_TASKER":
      return {
        ...state,
        taskerDetails: {
          ...state.taskerDetails,
          ...action.payload,
        },
      };
    case "UPDATE_SELLER":
      return {
        ...state,
        sellerDetails: { ...state.sellerDetails, ...action.payload },
      };
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, state.currentProduct],
        currentProduct: {
          name: "",
          image1: "",
          image2: "",
          image3: "",
          mrp: "",
          msp: "",
        },
      };
    case "UPDATE_CURRENT_PRODUCT":
      return {
        ...state,
        currentProduct: { ...state.currentProduct, ...action.payload },
      };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((_, index) => index !== action.payload),
      };
    case "RESET_FORM":
      return {
        ...initialState,
        step: 0,
      };
    default:
      return state;
  }
};

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);
  return (
    <RegistrationContext.Provider value={{ state, dispatch }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistration must be used within RegistrationProvider");
  }
  return context;
};
