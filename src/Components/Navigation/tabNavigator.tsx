import { NetInfoState, addEventListener } from '@react-native-community/netinfo';
import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { InternalRoutes } from '../../Library/Enums/InternalRoutes';
import { BookList } from '../BookList/bookList';
import { ReaderSection } from '../ReaderSection/readerSection';
import { TopBooks } from '../TopBooks/topBooks';

const Tab = createMaterialBottomTabNavigator();

export const TabNavigator: React.FC = (): JSX.Element => {
    const insets: EdgeInsets = useSafeAreaInsets();
    const [isOnline, setIsOnline] = React.useState<boolean>(false);

    React.useEffect((): void => {
        addEventListener((state: NetInfoState): void => {
            setIsOnline(state.isConnected ?? false);
        });
    }, []);

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
            {
                isOnline &&
                <>
                    <Tab.Screen
                        name={InternalRoutes.TopBooks}
                        component={TopBooks}
                        options={{
                            title: InternalRoutes.TopBooks,
                            tabBarIcon: "chart-bar",
                        }}
                    />
                    <Tab.Screen
                        name={InternalRoutes.ReadingBookList}
                        component={ReaderSection}
                        options={{
                            title: InternalRoutes.ReadingBookList,
                            tabBarIcon: "magnify",
                        }}
                    />
                </>
            }
        </Tab.Navigator>
    );
};