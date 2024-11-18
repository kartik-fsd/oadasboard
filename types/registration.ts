export interface TaskerDetails {
    name: string;
    phone: string;
}

export interface SellerDetails {
    sellerName: string;
    sellerPhoneNumber: string;
    gstNumber: string;
    shopImage: string | null;
}

export interface Product {
    name: string;
    image1: string;
    image2: string;
    image3: string;
    mrp: string;
    msp: string;
}

export interface RegistrationState {
    step: number;
    taskerDetails: TaskerDetails;
    sellerDetails: SellerDetails;
    products: Product[];
    currentProduct: Product;
}

export type RegistrationAction =
    | { type: 'SET_STEP'; payload: number }
    | { type: 'UPDATE_TASKER'; payload: Partial<TaskerDetails> }
    | { type: 'UPDATE_SELLER'; payload: Partial<SellerDetails> }
    | { type: 'ADD_PRODUCT'; payload?: undefined }
    | { type: 'UPDATE_CURRENT_PRODUCT'; payload: Partial<Product> }
    | { type: 'REMOVE_PRODUCT'; payload: number }
    | { type: 'RESET_FORM' };
