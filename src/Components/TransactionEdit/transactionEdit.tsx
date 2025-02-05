import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { useToast } from "react-native-paper-toast";
import { ToastMethods, ToastOptions } from "react-native-paper-toast/dist/typescript/src/types";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { ViewModes } from "../../Library/Enums/ViewModes";
import { EditNavigationProps } from "../../Library/routeParams";
import { getErrorNotificationOptions, getSuccessNotificationOptions } from "../../Library/Utils/toastUtils";
import { CustomResponse } from "../../Models/CustomResponse";
import { Transaction } from "../../Models/Transaction";
import { IServices, useServices } from "../../Providers/servicesProvider";
import { CANCEL, CREATE_TITLE, CREATE_SUCCESSFUL_MESSAGE, EDIT_TITLE, EDIT_SUCCESSFUL_MESSAGE, getEditStyles, SAVE, SAVE_FAILED_MESSAGE, VIEW_TITLE } from "./transactionEdit.styles";
import { formatDate } from "../../Library/Utils/dateUtils";

const defaultTransaction: Transaction = {
    id: -1,
    date: formatDate(new Date()),
    amount: NaN,
    type: "",
    category: "",
    description: ""
};

const createSuccessToast: ToastOptions = getSuccessNotificationOptions(CREATE_SUCCESSFUL_MESSAGE);
const editSuccessToast: ToastOptions = getSuccessNotificationOptions(EDIT_SUCCESSFUL_MESSAGE);
const saveFailedToast: ToastOptions = getErrorNotificationOptions(SAVE_FAILED_MESSAGE);
const fetchFailedToast: ToastOptions = getErrorNotificationOptions(SAVE_FAILED_MESSAGE);

export const TransactionEdit: React.FC<EditNavigationProps> = (props: EditNavigationProps): JSX.Element => {
    const insets: EdgeInsets = useSafeAreaInsets();
    const viewMode: ViewModes = props.route.params.viewMode;
    const toaster: ToastMethods = useToast();
    const services: IServices = useServices();
    const [transaction, setTransaction] = useState<Transaction>(defaultTransaction);
    const editStyles = getEditStyles(insets);

    React.useEffect((): void => {
        fetchTransaction();
    }, []);

    const fetchTransaction = async (): Promise<void> => {
        if (!props.route.params.id) {
            return;
        }

        try {
            const response: CustomResponse<Transaction> = await services.TransactionService.Get(props.route.params.id);
            setTransaction(response.data);
        }
        catch (error) {
            toaster.show(fetchFailedToast);
        }
    };

    const onInputChange = (field: keyof Transaction, value: string | string[] | number | Date) => {
        setTransaction((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onSave = async (): Promise<void> => {
        try {
            switch (viewMode) {
                case ViewModes.CREATE:
                    await services.TransactionService.Create(transaction);
                    toaster.show(createSuccessToast);
                    props.navigation.navigate(InternalRoutes.TabNavigator);
                    break;
                case ViewModes.EDIT:
                    await services.TransactionService.Update(transaction);
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
                <DatePickerInput
                    label="Date"
                    locale="en"
                    value={new Date(transaction.date)}
                    onChange={(date: CalendarDate): void => onInputChange("date", formatDate(date))}
                    inputMode="start"
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label="Amount"
                    value={transaction.amount ? transaction.amount.toString() : ""}
                    keyboardType="numeric"
                    onChangeText={(text) => onInputChange("amount", parseFloat(text))}
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label={"Type"}
                    value={transaction.type}
                    onChangeText={(text) => onInputChange("type", text)}
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label="Category"
                    value={transaction.category}
                    onChangeText={(text) => onInputChange("category", text)}
                    style={editStyles.input}
                    disabled={viewMode === ViewModes.VIEW}
                />
                <TextInput
                    label={"Description"}
                    value={transaction.description}
                    onChangeText={(text) => onInputChange("description", text)}
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