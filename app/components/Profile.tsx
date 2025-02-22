import * as React from "react"
import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  TextStyle
} from "react-native"
import { colors, spacing } from "app/theme"
import { Text } from "./Text"
import { useStores } from "app/models"
import { ageCalculator } from "app/models/helpers/dateHelpers"


interface ProfileProps extends TouchableOpacityProps {
 
  /**
   * Style overrides for the profile image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the profile container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the profile is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered profile.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Profile.md)
 */
export function Profile(props: ProfileProps) {
  const {
   
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const { patientStore } = useStores()
  const [currentPatient, setCurrentPatient] = React.useState(patientStore.getSelectedPatient())

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View

  if(currentPatient.length > 0)
    return (
      <View style={$patientProfileView}>
         <View style={$patientItemTitleView}>
          <Text testID="login-heading" 
            preset="bold" 
            style={$patientTitleText}
          >
            {'MRN ' + currentPatient[0].MRNNo}
          </Text>
        </View>
        <View style={$patientItemDetailView}>
          <Text testID="login-heading" 
            preset="bold" 
            style={$patientsText}
          >
            {currentPatient[0].FirstName + ' ' + currentPatient[0].LastName}
          </Text>
          <Text testID="login-heading" 
            preset="default" 
            style={$patientsText}
          >
            {
            // currentPatient[0].MRNNo + ' | ' +
            currentPatient[0].Gender + ' | ' + ageCalculator(currentPatient[0].DOB)}
          </Text>
        </View>
      </View>
    )
  else
    return null
}


const $imageStyle: ImageStyle = {
  resizeMode: "contain",
}

const $patientProfileView: ViewStyle = {
  height: 100,
  elevation: 8,
  marginVertical: spacing.md,
  backgroundColor: colors.themeColorDark,
  borderRadius: 10,
}

const $patientProfileText: TextStyle = {
  color: 'white'
}

const $patientItemTitleView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.themeColorDark,
  borderTopRightRadius: 6,
  borderTopLeftRadius: 6,
  padding: spacing.sm,
  borderWidth: 0.25,
  elevation: 0
}

const $patientItemDetailView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.themeColorLight,
  borderBottomRightRadius: 6,
  borderWidth: 0.25,
  borderBottomLeftRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: spacing.sm
}

const $patientTitleText: TextStyle = {
  fontSize: 14,
  color: 'white'
  // paddingHorizontal: spacing.sm
}

const $patientsText: TextStyle = {
  fontSize: 13
  // padding: spacing.sm,
}