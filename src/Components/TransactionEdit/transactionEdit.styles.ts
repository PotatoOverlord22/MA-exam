import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";

export const CREATE_TITLE: string = "Create Transaction";
export const EDIT_TITLE: string = "Edit Transaction";
export const VIEW_TITLE: string = "View Transaction details";
export const SELECT_DATE: string = "Select creation date";
export const SAVE: string = "Save";
export const CANCEL: string = "Cancel";

export const CREATE_SUCCESSFUL_MESSAGE: string = "Successfully created Transaction";
export const EDIT_SUCCESSFUL_MESSAGE: string = "Successfully edited Transaction";
export const SAVE_FAILED_MESSAGE: string = "Failed to save Transaction";
export const FETCH_FAILED_MESSAGE: string = "Failed to fetch Transaction";

export const getEditStyles = (insets: EdgeInsets) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Math.max(insets.top, 15),
        paddingLeft: Math.max(insets.left, 15),
        paddingRight: Math.max(insets.right, 15),
        paddingBottom: insets.bottom,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 20,
        width: "40%",
    },
});