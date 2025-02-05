import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { CustomResponse } from "../../Models/CustomResponse";
import { Transaction } from "../../Models/Transaction";
import { useServices } from "../../Providers/servicesProvider";
import { entityListStyles } from "../TransactionList/transactionList.styles";

export const Insights: React.FC = (): JSX.Element => {
    const services = useServices();
    const toaster = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [topSpendingCategories, setTopSpendingCategories] = useState<{ category: string; totalAmount: number }[]>([]);

    useEffect(() => {
        fetchSpendingInsights();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchSpendingInsights();
        }, [])
    );

    const fetchSpendingInsights = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response: CustomResponse<Transaction[]> = await services.TransactionService.GetAllCustomPages();
            const categorySpending: Record<string, number> = {};

            // Calculate the total spending per category
            response.data.forEach((transaction) => {
                if (transaction.amount) {
                    categorySpending[transaction.category] = (categorySpending[transaction.category] || 0) + transaction.amount;
                }
            });

            // Sort categories by total spending and get the top 3
            const sortedCategories = Object.entries(categorySpending)
                .map(([category, totalAmount]) => ({ category, totalAmount }))
                .sort((a, b) => b.totalAmount - a.totalAmount)
                .slice(0, 3);

            setTopSpendingCategories(sortedCategories);
        } catch (error) {
            toaster.show({ message: "Error fetching spending insights", type: "error" });
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
                        Top 3 Categories by Spending
                    </Text>
                    {topSpendingCategories.map(({ category, totalAmount }, index) => (
                        <List.Item
                            key={index}
                            title={category}
                            description={`Total Spending: $${totalAmount.toFixed(2)}`}
                            left={(props) => <List.Icon {...props} icon="cash" />}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
