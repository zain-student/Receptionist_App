import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { PatientSearchScreen, HomeScreen, HomeDebugScreen, TodaysPatientsScreen, PatientStatusScreen } from "../screens"
import { HomePodcastListScreen } from "../screens/HomePodcastListScreen"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type HomeTabParamList = {
  PatientSearch: undefined
  HomeScreen: { queryIndex?: string; itemIndex?: string }
  PatientAdvanceSearchScreen: undefined
  TodaysPatients: undefined
  PatientStatus: undefined
  HomeDebug: undefined
  HomePodcastList: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type HomeTabScreenProps<T extends keyof HomeTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<HomeTabParamList>()

export function HomeNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          // tabBarLabel: translate("homeNavigator.homeScreen"),
          tabBarLabel: ({focused, color}) => (
            <Text style={{color: focused ? colors.themeText: color}}>
              {translate("homeNavigator.homeScreen")}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon icon={focused ? "home_blue" : "home" }
            // color={focused && colors.tint}
             size={34} 
              // style={{ borderWidth: 2, borderColor: focused ? colors.themeText : colors.background}}
            />
            
          ),
        }}
      />

      <Tab.Screen
        name="PatientSearch"
        component={PatientSearchScreen}
        options={{
          // tabBarLabel: translate("homeNavigator.patientSearch"),
          tabBarLabel: ({focused, color}) => (
            <Text style={{color: focused ? colors.themeText: color}}>
              {translate("homeNavigator.patientSearch")}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon icon={focused ? "search_blue" : "search" } 
            // color={focused && colors.tint} 
            size={34} 
            // style={{ borderWidth: 2, borderColor: focused ? colors.themeText : colors.background}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="TodaysPatients"
        component={TodaysPatientsScreen}
        options={{
          tabBarAccessibilityLabel: translate("homeNavigator.todaysPatients"),
          // tabBarLabel: translate("homeNavigator.todaysPatients"),
          tabBarLabel: ({focused, color}) => (
            <Text style={{color: focused ? colors.themeText: color}}>
              {translate("homeNavigator.todaysPatients")}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon icon={focused ? "queue_blue" : "queue"}
            size={34}
            // style={{ borderWidth: 2, borderColor: focused ? colors.themeText : colors.background}}
            />
          ),
        }}
      />

      <Tab.Screen
        name="PatientStatus"
        component={PatientStatusScreen} 
        options={{
          // tabBarLabel: translate("homeNavigator.patientStatus"),
          tabBarLabel: ({focused, color}) => (
            <Text style={{color: focused ? colors.themeText: color}}>
              {translate("homeNavigator.patientStatus")}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon icon={focused ? "status_blue" : "status"}
            // color={focused && colors.tint} 
            size={34}
            // style={{ borderWidth: 2, borderColor: focused ? colors.themeText : colors.background}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
  elevation: 5
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
