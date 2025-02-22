import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import * as Screens from "app/screens"

import { HomePodcastListScreen } from "../screens/HomePodcastListScreen"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type ProfileStackParamList = {
  
  ProfileBasicInfoScreen: { queryIndex?: string; itemIndex?: string }
  ProfileAddressScreen: undefined
  ProfileContactScreen: undefined
  ProfileEmergencyContact: undefined
  ProfileConsentScreen: undefined
 
}


/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<
ProfileStackParamList,
T
>

const Stack = createNativeStackNavigator<ProfileStackParamList>()

export function ProfileNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}

      // screenOptions={{
      //   headerShown: false,
      //   tabBarHideOnKeyboard: true,
      //   tabBarStyle: [$tabBar, { height: bottom + 70 }],
      //   tabBarActiveTintColor: colors.text,
      //   tabBarInactiveTintColor: colors.text,
      //   tabBarLabelStyle: $tabBarLabel,
      //   tabBarItemStyle: $tabBarItem,
      // }}
    >
    <Stack.Screen name="ProfileBasicInfoScreen" component={Screens.ProfileBasicInfoScreen} />
    <Stack.Screen name="ProfileAddressScreen" component={Screens.ProfileAddressScreen} />
    <Stack.Screen name="ProfileContactScreen" component={Screens.ProfileContactScreen} />
    <Stack.Screen name="ProfileEmergencyContact" component={Screens.ProfileEmergencyContact} />
    <Stack.Screen name="ProfileConsentScreen" component={Screens.ProfileConsentScreen} />

    
      {/* <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: translate("homeNavigator.homeScreen"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="community" color={focused && colors.tint} size={30} />
          ),
        }}
      /> */}

    </Stack.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
}

// @home remove-file
