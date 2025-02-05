import { ToastOptions } from "react-native-paper-toast";
import { getErrorNotificationOptions } from "./Utils/toastUtils";

export const NO_INTERNET_MESSAGE: string = "No internet connection. Please check your network.";
export const RETRY: string = "Retry";

export const IP_ADDRESS: string = "172.30.245.53";
export const PORT: number = 2505;
export const DATABASE_NAME: string = "books.db";

export const usingCachedDataNotification: ToastOptions = getErrorNotificationOptions("No internet connection, showing cached data.");