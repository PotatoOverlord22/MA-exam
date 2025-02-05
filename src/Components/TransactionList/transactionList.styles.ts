import { StyleSheet } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export const LIST_BUTTON_SIZE: number = 30;
export const LIST_ITEM_ICON: IconSource = "book";
export const CREATE_ICON: IconSource = "plus";
export const EDIT_ICON: IconSource = "pencil";
export const DELETE_ICON: IconSource = "delete";
export const FETCH_ALL_ERROR_MESSAGE: string = "Failed to fetch transactions";
export const FETCH_ALL_SUCCESS_MESSAGE: string = "Successfully fetched transactions";
export const DELETE_SUCCESS_MESSAGE: string = "Successfully deleted transaction";
export const DELETE_ERROR_MESSAGE: string = "Failed to deleted transaction";

export const entityListStyles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    iconButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
    activityIndicatorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    noInternetContainer: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    }
});