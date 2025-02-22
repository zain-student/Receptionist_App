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
import { spacing } from "app/theme"
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
        <Text testID="login-heading" 
          preset="bold" style={$patientProfileText}>
          {currentPatient[0].FirstName + ' ' + currentPatient[0].LastName}
        </Text>
        <View style={{flexDirection: 'row'}}>
        <Text testID="login-heading" 
          preset="bold" style={$patientProfileText}>
          {currentPatient[0].MRNNo ? currentPatient[0].MRNNo + ' ' : ''}
        </Text>
        <Text testID="login-heading" 
          preset="bold" style={$patientProfileText}>
          {currentPatient[0].Gender ? currentPatient[0].Gender + ' ': ''}
        </Text>
        <Text testID="login-heading" 
          preset="bold" style={$patientProfileText}>
          {currentPatient[0].DOB ? ageCalculator(currentPatient[0].DOB) + ' ' : ''}
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
  backgroundColor: 'green',
  padding: spacing.sm
}

const $patientProfileText: TextStyle = {
  color: 'white'
}
