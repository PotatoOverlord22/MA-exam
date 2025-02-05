import { addEventListener, NetInfoState } from "@react-native-community/netinfo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, FAB, IconButton, List, Text } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { ToastMethods, ToastOptions } from "react-native-paper-toast/dist/typescript/src/types";
import { ConnectionStates } from "../../Library/Enums/ConnectionStates";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { Sources } from "../../Library/Enums/Sources";
import { ViewModes } from "../../Library/Enums/ViewModes";
import { NO_INTERNET_MESSAGE, RETRY, usingCachedDataNotification } from "../../Library/generalConstants";
import { StackNavigatorType } from "../../Library/routeParams";
import { } from "../../Library/toastConstants";
import { getErrorNotificationOptions, getSuccessNotificationOptions } from "../../Library/Utils/toastUtils";
import { CustomResponse } from "../../Models/CustomResponse";
import { Transaction } from "../../Models/Transaction";
import { IServices, useServices } from "../../Providers/servicesProvider";
import { CREATE_ICON, DELETE_ICON, DELETE_ERROR_MESSAGE, DELETE_SUCCESS_MESSAGE, EDIT_ICON, FETCH_ALL_ERROR_MESSAGE, FETCH_ALL_SUCCESS_MESSAGE, LIST_BUTTON_SIZE, LIST_ITEM_ICON, entityListStyles } from "./transactionList.styles";

const fetchSuccessToast: ToastOptions = getSuccessNotificationOptions(FETCH_ALL_SUCCESS_MESSAGE);
const fetchErrorToast: ToastOptions = getErrorNotificationOptions(FETCH_ALL_ERROR_MESSAGE);
const deleteSuccessToast: ToastOptions = getSuccessNotificationOptions(DELETE_SUCCESS_MESSAGE);
const deleteErrorToast: ToastOptions = getErrorNotificationOptions(DELETE_ERROR_MESSAGE);

export const TransactionList: React.FC = (): JSX.Element => {
    const services: IServices = useServices();
    const navigator: StackNavigatorType = useNavigation<StackNavigatorType>();
    const toaster: ToastMethods = useToast();
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [connectionStatus, setConnectionStatus] = React.useState<ConnectionStates>(ConnectionStates.OFFLINE);

    React.useEffect((): void => {
        addEventListener((state: NetInfoState): void => {
            // ROMANEASCA
            setConnectionStatus((prevStatus: ConnectionStates): ConnectionStates => {
                if (state.isConnected && prevStatus === ConnectionStates.OFFLINE) {
                    return prevStatus;
                }
                fetchAllData();
                return prevStatus;
            });
        });

        fetchAllData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchAllData();
        }, [])
    );

    const fetchAllData = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const serviceResponse: CustomResponse<Transaction[]> = await services.TransactionService.GetAll();
            if (serviceResponse.source === Sources.NETWORK) {
                setConnectionStatus(ConnectionStates.ONLINE);
                toaster.show(fetchSuccessToast);
            }
            else if (serviceResponse.source === Sources.LOCAL) {
                toaster.show(usingCachedDataNotification);
                setConnectionStatus(ConnectionStates.LOCAL);
            }

            setTransactions(serviceResponse.data);
        }
        catch (error) {
            toaster.show(fetchErrorToast);
            setConnectionStatus(ConnectionStates.OFFLINE);
        }
        finally {
            setIsLoading(false);
        }
    };

    const onCreate = (): void => {
        navigator.navigate(InternalRoutes.Edit, { viewMode: ViewModes.CREATE });
    };

    const onViewDetails = (transaction: Transaction): void => {
        navigator.navigate(InternalRoutes.Edit, { id: transaction.id, viewMode: ViewModes.VIEW });
    };

    const onEdit = (transaction: Transaction): void => {
        navigator.navigate(InternalRoutes.Edit, { id: transaction.id, viewMode: ViewModes.EDIT });
    };

    const onDelete = async (transaction: Transaction): Promise<void> => {
        try {
            await services.TransactionService.Delete(transaction.id);
            toaster.show(deleteSuccessToast);
            setTransactions((prev: Transaction[]): Transaction[] => prev.filter((e: Transaction): boolean => e.id !== transaction.id));
        }
        catch (error) {
            toaster.show(deleteErrorToast);
        }
    };

    if (connectionStatus === ConnectionStates.OFFLINE) {
        return (
            <View style={entityListStyles.noInternetContainer}>
                <Text>{NO_INTERNET_MESSAGE}</Text>
                <Button mode="contained" onPress={fetchAllData}>
                    {RETRY}
                </Button>
            </View>
        );
    };

    return (
        <View style={entityListStyles.mainContainer}>
            {isLoading ? (
                <View style={entityListStyles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true} size={"large"} />
                </View>
            ) : (
                <ScrollView>
                    {transactions.map((transaction: Transaction): JSX.Element => (
                        <List.Item
                            key={transaction.id}
                            title={transaction.category}
                            description={transaction.type}
                            onPress={(): void => onViewDetails(transaction)}
                            left={(props): JSX.Element => <List.Icon {...props} icon={LIST_ITEM_ICON} />}
                            right={(props): JSX.Element =>
                                <View style={entityListStyles.iconButtonContainer}>
                                    <IconButton
                                        {...props}
                                        icon={EDIT_ICON}
                                        size={LIST_BUTTON_SIZE}
                                        onPress={(): void => onEdit(transaction)}
                                        disabled={connectionStatus !== ConnectionStates.ONLINE}
                                    />
                                    <IconButton
                                        {...props}
                                        icon={DELETE_ICON}
                                        size={LIST_BUTTON_SIZE}
                                        onPress={(): void => { void onDelete(transaction); }}
                                        disabled={connectionStatus !== ConnectionStates.ONLINE}
                                    />
                                </View>
                            }
                        />
                    ))}
                </ScrollView>
            )}
            <FAB
                icon={CREATE_ICON}
                onPress={onCreate}
                style={entityListStyles.fab}
                disabled={connectionStatus !== ConnectionStates.ONLINE}
            />
        </View>
    );
};