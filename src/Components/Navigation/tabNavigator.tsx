import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { InternalRoutes } from '../../Library/Enums/InternalRoutes';
import { Insights } from '../Insights/insights';
import { Reports } from '../Reports/reports';
import { BookList } from '../BookList/bookList';

const Tab = createMaterialBottomTabNavigator();

export const TabNavigator: React.FC = (): JSX.Element => {
    const insets: EdgeInsets = useSafeAreaInsets();

    return (
        <Tab.Navigator style={{ paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right, paddingBottom: insets.bottom, flex: 1 }} >
            <Tab.Screen
                name={InternalRoutes.Books}
                component={BookList}
                options={{
                    title: InternalRoutes.Books,
                    tabBarIcon: "book-open",
                }}
            />
            <Tab.Screen
                name={InternalRoutes.Insights}
                component={Insights}
                options={{
                    title: InternalRoutes.Insights,
                    tabBarIcon: "chart-bar",
                }}
            />
            <Tab.Screen
                name={InternalRoutes.Reports}
                component={Reports}
                options={{
                    title: InternalRoutes.Reports,
                    tabBarIcon: "magnify",
                }}
            />
        </Tab.Navigator>
    );
};