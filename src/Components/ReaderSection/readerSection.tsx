import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, List } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { Sources } from "../../Library/Enums/Sources";
import { usingCachedDataNotification } from "../../Library/generalConstants";
import { StackNavigatorType } from "../../Library/routeParams";
import { getErrorNotificationOptions, getSuccessNotificationOptions } from "../../Library/Utils/toastUtils";
import { Book } from "../../Models/Book";
import { CustomResponse } from "../../Models/CustomResponse";
import { IServices, useServices } from "../../Providers/servicesProvider";
import { entityListStyles, FETCH_ALL_ERROR_MESSAGE, FETCH_ALL_SUCCESS_MESSAGE, LIST_ITEM_ICON } from "../BookList/bookList.styles";

const fetchSuccessToast = getSuccessNotificationOptions(FETCH_ALL_SUCCESS_MESSAGE);
const fetchErrorToast = getErrorNotificationOptions(FETCH_ALL_ERROR_MESSAGE);

export const ReaderSection: React.FC = (): JSX.Element => {
    const services: IServices = useServices();
    const navigator: StackNavigatorType = useNavigation<StackNavigatorType>();
    const toaster = useToast();
    const [books, setBooks] = React.useState<Book[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        fetchAllData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchAllData();
        }, [])
    );

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const serviceResponse: CustomResponse<Book[]> = await services.BookService.GetAllCustomPages();
            if (serviceResponse.source === Sources.NETWORK) {
                // toaster.show(fetchSuccessToast);
            } else if (serviceResponse.source === Sources.LOCAL) {
                toaster.show(usingCachedDataNotification);
            }
            setBooks(serviceResponse.data.filter(book => book.status.toLowerCase() === "reading"));
        } catch (error) {
            toaster.show(fetchErrorToast);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={entityListStyles.mainContainer}>
            {isLoading ? (
                <View style={entityListStyles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true} size="large" />
                </View>
            ) : (
                <ScrollView>
                    {books.map((book) => (
                        <List.Item
                            key={book.id}
                            title={`${book.title} by ${book.author}`}
                            description={`${book.status} - ${book.reviewCount}`}
                            left={(props) => <List.Icon {...props} icon={LIST_ITEM_ICON} />}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
