import React, { FC, useState } from "react"
import { TouchableOpacity, Image, ImageStyle, TextStyle, View, ViewStyle, FlatList } from "react-native"
import { Button, Screen, Text } from "../../components"
import { PatientStackScreenProps } from "../../navigators/PatientNavigator"
import { spacing, colors } from "../../theme"

const PATIENT = {
    patientId: 6,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  }


const SITES = [
  {
    serviceId: 1,
    serviceName: 'Service1',
    price: 100
  },
  {
    serviceId: 2,
    serviceName: 'Service2',
    price: 50
  },
  {
    serviceId: 3,
    serviceName: 'Service3',
    price: 50
  }
]

export const SyncDataScreen: FC<PatientStackScreenProps<"SyncData">> =
  function SyncDataScreen(_props) {

    const [patient, setPatient] = useState('')
    const { navigation } = _props
    const [service, setService] = useState("")


   
  function submitPress() {
    // navigation.navigate("Profile")
  }

 


  const ServiceItem = ({title}) => (
    <View style={{flexDirection: 'row'}}>
      <Text testID="login-heading" 
      // tx={serviceName}
        preset="bold" style={$pageTitle}>
        {title.serviceName + ':     '}
      </Text>
      <Text testID="login-heading" 
      // tx={serviceName}
        preset="bold" style={$pageTitle}>
        {title.price}
      </Text>
    </View>
    );

  function onServicePress(title){
    console.log('=-=-=-=-=', title)
    setService(title)
  }
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        
  
        <View style={$buttonsView}>
          <Button
            testID="login-button"
            tx={'syncDataScreen.syncData'}
            style={$tapButton}
            preset="reversed"
            onPress={submitPress}
          />
        </View>
      </Screen>
    )
  }

const $container: ViewStyle = {
  // paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
  justifyContent: 'center'
}

const $title: TextStyle = {
  // flex: 0.5,
  textAlign: 'center',
  marginTop: spacing.xxxs,
}

const $patientsListView: ViewStyle = {
  flex: 3,
  borderWidth: 1,
  width: '60%',
  alignSelf: 'center',
  marginVertical: spacing.sm
}

const $patientsText: TextStyle = {
  padding: spacing.sm,
}

const $buttonsView: ViewStyle = {
  flexDirection: 'row',
  width: '100%',
}

const $totalAmountView: ViewStyle = {
  flex: 0.5,
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'center'
  // marginBottom: 40
}

const $tapButton: ViewStyle = {
  // flex: 1,
  width: '100%',
  height: 50,
  marginVertical: spacing.md,
}

const $serviceButton: ViewStyle = {
  flex: 1,
  borderWidth: 0.5,
  borderRadius: 5,
  margin: spacing.sm,
  elevation: 8,
  backgroundColor: colors.background
}

const $serviceListView: ViewStyle = {
  flex: 1,
  margin: spacing.md
}

const $pageTitle: TextStyle = {
  padding: spacing.sm,
  textAlign: 'center',
  alignSelf: 'center'
}

const $patientProfileView: ViewStyle = {
  backgroundColor: 'green',
  padding: spacing.sm
}

const $patientProfileText: TextStyle = {
  // padding: spacing.sm,
  // textAlign: 'center',
  // alignSelf: 'center',
  color: 'white'
}
// @home remove-file
