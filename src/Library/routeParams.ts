import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { InternalRoutes } from "./Enums/InternalRoutes";
import { ViewModes } from "./Enums/ViewModes";

export type StackParamList = {
    [InternalRoutes.TabNavigator]: undefined;
    [InternalRoutes.Edit]: { id?: number, viewMode: ViewModes };
};

export type StackNavigatorType = NativeStackNavigationProp<StackParamList>;
export type EditNavigationProps = NativeStackScreenProps<StackParamList, InternalRoutes.Edit>;