import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { useServices } from "../../Providers/servicesProvider";
import { CustomResponse } from "../../Models/CustomResponse";
import { Transaction } from "../../Models/Transaction";
import { entityListStyles } from "../TransactionList/transactionList.styles";
import { useFocusEffect } from "@react-navigation/native";

export const Reports: React.FC = (): JSX.Element => {
    const services = useServices();
    const toaster = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [monthlySpending, setMonthlySpending] = useState<{ month: string; totalAmount: number }[]>([]);

    useEffect(() => {
        fetchMonthlySpending();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchMonthlySpending();
        }, [])
    );

    const fetchMonthlySpending = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response: CustomResponse<Transaction[]> = await services.TransactionService.GetAllCustomPages();
            const monthSpending: Record<string, number> = {};

            // Calculate total spending per month
            response.data.forEach((transaction) => {
                if (transaction.amount && transaction.date) {
                    const month = new Date(transaction.date).toLocaleString("default", { month: "long", year: "numeric" });
                    monthSpending[month] = (monthSpending[month] || 0) + transaction.amount;
                }
            });

            // Sort months by total spending and get the list
            const sortedMonths = Object.entries(monthSpending)
                .map(([month, totalAmount]) => ({ month, totalAmount }))
                .sort((a, b) => b.totalAmount - a.totalAmount);

            setMonthlySpending(sortedMonths);
        } catch (error) {
            toaster.show({ message: "Error fetching monthly spending analysis", type: "error" });
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
                        Monthly Spending Analysis
                    </Text>
                    {monthlySpending.map(({ month, totalAmount }, index) => (
                        <List.Item
                            key={index}
                            title={month}
                            description={`Total Spending: $${totalAmount.toFixed(2)}`}
                            left={(props) => <List.Icon {...props} icon="calendar-month" />}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
