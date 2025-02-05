import React from "react";
import { useToast } from "react-native-paper-toast";
import { ToastMethods } from "react-native-paper-toast/dist/typescript/src/types";
import { IP_ADDRESS, PORT } from "../../Library/generalConstants";
import { getSuccessNotificationOptions } from "../../Library/Utils/toastUtils";
import { Book } from "../../Models/Book";
import { ParentStackNavigator } from "../Navigation/parentStackNavigator";

export const Root: React.FC = (): JSX.Element => {
    const toaster: ToastMethods = useToast();
    React.useEffect(() => {
        const websocket = new WebSocket(`ws://${IP_ADDRESS}:${PORT}`);

        websocket.onopen = () => {
            console.log(`Connected to the server on websocket ws://${IP_ADDRESS}:${PORT}.`);
        };

        websocket.onmessage = (message: MessageEvent) => {
            const data: Book = JSON.parse(message.data);
            toaster.show(getSuccessNotificationOptions(`${data.title}: ${data.author}`));
        };

        return () => {
            websocket.close();
            console.log("WebSocket connection closed.");
        };
    }, [toaster]);

    return (
        <ParentStackNavigator />
    );
};