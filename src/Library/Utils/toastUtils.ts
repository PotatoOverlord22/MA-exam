import { ToastOptions } from "react-native-paper-toast";
import { TOAST_DURATION, TOAST_POSITION, TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from "../toastConstants";

export const getErrorNotificationOptions = (message: string): ToastOptions => {
    return {
        message,
        type: TOAST_TYPE_ERROR,
        position: TOAST_POSITION,
        duration: TOAST_DURATION
    };
};

export const getSuccessNotificationOptions = (message: string): ToastOptions => {
    return {
        message,
        type: TOAST_TYPE_SUCCESS,
        position: TOAST_POSITION,
        duration: TOAST_DURATION
    };
};