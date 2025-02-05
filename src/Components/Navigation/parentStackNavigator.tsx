import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InternalRoutes } from "../../Library/Enums/InternalRoutes";
import { StackParamList } from "../../Library/routeParams";
import { BookEdit } from "../BookEdit/bookEdit";
import { TabNavigator } from "./tabNavigator";

const StackNavigator = createNativeStackNavigator<StackParamList>();

export const ParentStackNavigator: React.FC = (): JSX.Element => {
    return (
        <StackNavigator.Navigator initialRouteName={InternalRoutes.TabNavigator}>
            <StackNavigator.Screen
                name={InternalRoutes.TabNavigator}
                component={TabNavigator}
                options={{
                    headerShown: false
                }}
            />
            <StackNavigator.Screen
                name={InternalRoutes.Edit}
                component={BookEdit}
                options={{
                    headerShown: false
                }}
            />
        </StackNavigator.Navigator>
    );
};