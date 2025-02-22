import React, { FC, useState } from "react"
import { TouchableOpacity, Image, ImageStyle, TextStyle, View, ViewStyle, FlatList } from "react-native"
import { Button, ListItem, TextField, Screen, Text } from "../../components"
import { HomeTabScreenProps } from "../../navigators/HomeNavigator"
import { PatientStackScreenProps } from "../../navigators/PatientNavigator"
import { spacing, colors } from "../../theme"
import { openLinkInBrowser } from "../../utils/openLinkInBrowser"
import { isRTL } from "../../i18n"
import DropDownPicker from 'react-native-dropdown-picker';
import { ProfileStackScreenProps } from "app/navigators"
import { WebView } from 'react-native-webview';

const RELATIONSHIP = [
  {
    id: 1,
    label: 'Brother',
    value: 'Brother'
  },
  {
    id: 2,
    label: 'Father',
    value: 'Father'
  },
  {
    id: 3,
    label: 'Mother',
    value: 'Mother'
  },
  {
    id: 4,
    label: 'Sister',
    value: 'Sister'
  },
]

export const ProfileConsentScreen: FC<ProfileStackScreenProps<"ProfileConsentScreen">> =
  function ProfileEmergencyContact(_props) {

    const { navigation } = _props

    const [relationshipDropdownOpen, setRelationshipDropdownOpen] = useState(false);
    const [relationship, setRelationship] = useState([]);


    const [name, setName] = useState('')

    const [contact, setContact] = useState('')


   
    const PatientItem = ({title}) => (
      <View>
        <Text testID="login-heading" 
          preset="bold" 
          style={$patientsText}
          >
          {title}
        </Text>
      </View>
)

  function patientItemPress(title: React.SetStateAction<string>) {
    console.log('-=-=-=-=-=-=-=-=-', title)
    console.log('-=-=-=-=-=-=-=-=-', patient)
    setPatient(title)
  }

  function submit() {
    navigation.reset
    navigation.navigate("Patient")
  }
    return (
      <Screen preset="scroll" contentContainerStyle={$container}
      //  safeAreaEdges={["top"]}
       >
        <Text preset="heading" tx="patientConsentScreen.patientConsent" style={$title} />

        <WebView 
        source={{ uri: 'https://google.com/' }} style={$webView} />
        <View style={$buttonView}>
          <View style={$fingerpringView}/>
          <Button
            testID="login-button"
            tx={'patientConsentScreen.submit'}
            style={$tapButton}
            preset="reversed"
            onPress={submit}
          />
        </View>
      </Screen>
    )
  }

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
}

const $title: TextStyle = {
  // flex: 0.25,
  marginBottom: spacing.sm,
}

const $fieldsView: ViewStyle = {
  flex: 6,
 
}

const $patientsText: TextStyle = {
  padding: spacing.sm,
}

const $buttonView: ViewStyle = {
  flex: 0.5,
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',

}
const $tapButton: ViewStyle = {
  width: '70%',
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
  width: '80%'
}

const $fieldRowView: ViewStyle = {
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-around'
}

const $dropdownView: ViewStyle = {
  width: '80%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.background,
  marginBottom: spacing.lg
  // paddingHorizontal: 15
}

const $webView: ViewStyle = {
  width: '100%',
  height: '100%',
  flex: 1.5
}

const $fingerpringView: ViewStyle = {
  height: 60,
  width: 70,
  // height: 60,
  borderWidth: 1
}

// @home remove-file
