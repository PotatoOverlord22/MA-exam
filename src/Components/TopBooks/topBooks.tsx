import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { CustomResponse } from "../../Models/CustomResponse";
import { Book } from "../../Models/Book";
import { useServices } from "../../Providers/servicesProvider";
import { entityListStyles } from "../BookList/bookList.styles";

export const TopBooks: React.FC = (): JSX.Element => {
    const services = useServices();
    const toaster = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [topRatedBooks, setTopRatedBooks] = useState<Book[]>([]);

    useEffect(() => {
        fetchTopRatedBooks();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchTopRatedBooks();
        }, [])
    );

    const fetchTopRatedBooks = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response: CustomResponse<Book[]> = await services.BookService.GetAllCustomPages();

            // Filter books with valid rating and review count
            const filteredBooks = response.data.filter(
                (book) => book.avgRating !== undefined && book.reviewCount !== undefined
            );

            // Sort books by rating (descending) and review count (descending)
            const sortedBooks = filteredBooks
                .sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
                .slice(0, 5);

            setTopRatedBooks(sortedBooks);
        } catch (error) {
            toaster.show({ message: "Error fetching top-rated books", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={entityListStyles.mainContainer}>
            {isLoading ? (
                <View style={entityListStyles.activityIndicatorContainer}>
                    <ActivityIndicator animating size="large" />
                </View>
            ) : (
                <ScrollView>
                    <Text variant="headlineMedium">
                        Top 5 Highest-Rated Books
                    </Text>
                    {topRatedBooks.map(({ id, title, avgRating, reviewCount }) => (
                        <List.Item
                            key={id}
                            title={title}
                            description={`Rating: ${avgRating.toFixed(1)} ⭐ | Reviews: ${reviewCount}`}
                            left={(props) => <List.Icon {...props} icon="book" />}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
