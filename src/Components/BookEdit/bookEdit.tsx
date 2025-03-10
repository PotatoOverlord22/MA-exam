import { addEventListener, NetInfoState } from '@react-native-community/netinfo';
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { ToastMethods, ToastOptions } from "react-native-paper-toast/dist/typescript/src/types";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { ViewModes } from "../../Library/Enums/ViewModes";
import { EditNavigationProps } from "../../Library/routeParams";
import { getErrorNotificationOptions, getSuccessNotificationOptions } from "../../Library/Utils/toastUtils";
import { Book } from "../../Models/Book";
import { CustomResponse } from "../../Models/CustomResponse";
import { IServices, useServices } from "../../Providers/servicesProvider";
import { CANCEL, CREATE_SUCCESSFUL_MESSAGE, CREATE_TITLE, EDIT_SUCCESSFUL_MESSAGE, EDIT_TITLE, getEditStyles, SAVE, SAVE_FAILED_MESSAGE, VIEW_TITLE } from "./bookEdit.styles";

const defaultBook: Book = {
    id: -1,
    title: "",
    author: "",
    genre: "",
    status: "",
    reviewCount: 0,
    avgRating: 0,
};

const createSuccessToast: ToastOptions = getSuccessNotificationOptions(CREATE_SUCCESSFUL_MESSAGE);
const editSuccessToast: ToastOptions = getSuccessNotificationOptions(EDIT_SUCCESSFUL_MESSAGE);
const saveFailedToast: ToastOptions = getErrorNotificationOptions(SAVE_FAILED_MESSAGE);
const fetchFailedToast: ToastOptions = getErrorNotificationOptions(SAVE_FAILED_MESSAGE);

export const BookEdit: React.FC<EditNavigationProps> = (props: EditNavigationProps): JSX.Element => {
    const insets: EdgeInsets = useSafeAreaInsets();
    const viewMode: ViewModes = props.route.params.viewMode;
    const toaster: ToastMethods = useToast();
    const services: IServices = useServices();
    const [book, setBook] = useState<Book>(defaultBook);
    const editStyles = getEditStyles(insets);
    const [isOnline, setIsOnline] = React.useState<boolean>(false);

    React.useEffect((): void => {
        addEventListener((state: NetInfoState): void => {
            setIsOnline(state.isConnected ?? false);
        });
    }, []);

    React.useEffect((): void => {
        fetchBook();
    }, []);

    const fetchBook = async (): Promise<void> => {
        if (!props.route.params.id) {
            return;
        }

        try {
            const response: CustomResponse<Book> = await services.BookService.Get(props.route.params.id);
            setBook(response.data);
        }
        catch (error) {
            toaster.show(fetchFailedToast);
        }
    };

    const onInputChange = (field: keyof Book, value: string | string[] | number | Date) => {
        setBook((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onSave = async (): Promise<void> => {
        try {
            switch (viewMode) {
                case ViewModes.CREATE:
                    if (isOnline) {
                        await services.BookService.Create(book);
                    }
                    else {
                        await services.BookService.CreateOffline(book);
                    }
                    toaster.show(createSuccessToast);
                    props.navigation.navigate(InternalRoutes.TabNavigator);
                    break;
                case ViewModes.EDIT:
                    await services.BookService.Update(book);
                    toaster.show(editSuccessToast);
                    props.navigation.navigate(InternalRoutes.TabNavigator);
                    break;
            }
        }
        catch (error) {
            toaster.show(saveFailedToast);
        }
    };

    const onCancel = (): void => {
        props.navigation.goBack();
    };

    const getViewTitle = (): string => {
        switch (viewMode) {
            case ViewModes.CREATE:
                return CREATE_TITLE;
            case ViewModes.EDIT:
                return EDIT_TITLE;
            case ViewModes.VIEW:
                return VIEW_TITLE;
            default:
                return "";
        };
    };

    return (
        <SafeAreaView style={editStyles.container}>
            <ScrollView>
                <Text variant="headlineLarge" style={editStyles.input}>
                    {getViewTitle()}
                </Text>
                <TextInput
                    label={"Title"}
                    value={book.title}
                    onChangeText={(text) => onInputChange("title", text)}
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label="Author"
                    value={book.author}
                    onChangeText={(text) => onInputChange("author", text)}
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label={"Genre"}
                    value={book.genre}
                    onChangeText={(text) => onInputChange("genre", text)}
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label={"Status"}
                    value={book.status}
                    onChangeText={(text) => onInputChange("status", text)}
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label="Review Count"
                    value={book.reviewCount ? book.reviewCount.toString() : ""}
                    keyboardType="numeric"
                    onChangeText={(text) => onInputChange("reviewCount", parseInt(text))}
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label="Average Rating"
                    value={book.reviewCount ? book.avgRating.toString() : ""}
                    keyboardType="numeric"
                    onChangeText={(text) => onInputChange("avgRating", parseFloat(text))}
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />

                {viewMode !== ViewModes.VIEW && (
                    <View style={editStyles.buttonContainer}>
                        <Button mode="contained" onPress={onSave} style={editStyles.button}>
                            {SAVE}
                        </Button>
                        <Button mode="contained" onPress={onCancel} style={editStyles.button}>
                            {CANCEL}
                        </Button>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};