import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import merge from 'deepmerge';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme, PaperProvider } from 'react-native-paper';
import { en, registerTranslation } from 'react-native-paper-dates';
import { ToastProvider } from 'react-native-paper-toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IP_ADDRESS, PORT } from '../../Library/generalConstants';
import { ServicesProvider } from '../../Providers/servicesProvider';
import { Root } from '../Root/root';

registerTranslation('en', en);

export default function App() {
    const CombinedDefaultTheme = merge(NavigationDefaultTheme, PaperDefaultTheme);
    const CombinedDarkTheme = merge(NavigationDarkTheme, PaperDarkTheme);

    const scheme = useColorScheme();
    const theme = scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme}>
                    <ToastProvider>
                        <ServicesProvider>
                            <Root />
                        </ServicesProvider>
                    </ToastProvider>
                </NavigationContainer>
            </PaperProvider>
        </SafeAreaProvider>
    );
};