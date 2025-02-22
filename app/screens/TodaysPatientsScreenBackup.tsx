import React, { FC, useState } from "react"
import { TouchableOpacity, Image, ImageStyle, TextStyle, View, ViewStyle, FlatList } from "react-native"
import { Button, ListItem, Screen, Text } from "../components"
import { HomeTabScreenProps } from "../navigators/HomeNavigator"
import { spacing, colors } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { isRTL } from "../i18n"
import { useStores } from "app/models"
import { ageCalculator } from "app/models/helpers/dateHelpers"

const chainReactLogo = require("../../assets/images/cr-logo.png")
const reactNativeLiveLogo = require("../../assets/images/rnl-logo.png")
const reactNativeRadioLogo = require("../../assets/images/rnr-logo.png")
const reactNativeNewsletterLogo = require("../../assets/images/rnn-logo.png")

const PATIENTS = [
  {
    patientId: 1,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  {
    patientId: 2,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  {
    patientId: 3,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  {
    patientId: 4,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  {
    patientId: 5,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  {
    patientId: 6,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  {
    patientId: 7,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  {
    patientId: 8,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  {
    patientId: 9,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  {
    patientId: 10,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M'
  },
  
]


export const TodaysPatientsScreen: FC<HomeTabScreenProps<"TodaysPatients">> =
  function TodaysPatientsScreen(_props) {

    const [patient, setPatient] = useState('')
    const { navigation } = _props
    const { patientStore } = useStores()
    const { patientQueue, patientQueueForList } = patientStore


    const PatientItem = ({title}) => (
      <View style={$patientItemView}>
         <View style={$patientItemTitleView}>
        <Text testID="login-heading" 
          preset="bold" 
          style={$patientTitleText}
        >
          {'MRN ' + title.MRNNo}
        </Text>
      </View>
      <View style={$patientItemDetailView}>
        <Text testID="login-heading" 
          preset="bold" 
          style={$patientsText}
        >
          {title.FirstName + ' ' + title.LastName}
        </Text>
        <Text testID="login-heading" 
          preset="default" 
          style={$patientsText}
        >
          {
          // item.MRNNo + ' | ' +
          title.Gender + ' | ' + ageCalculator(title.DOB)}
        </Text>
      </View>


        <View style={$patientItemTitleView}>
          <Text testID="login-heading" 
            preset="bold" 
            style={$patientTitleText}
            >
            {'MRN: ' + title.MRNNo}
          </Text>
        </View>
        <Text testID="login-heading" 
          preset="bold" 
          style={[$patientsText, {color: colors.palette.primary600}]}
          >
          {title.FirstName + ' ' + title.LastName}
        </Text>
        <Text testID="login-heading" 
          preset="bold" 
          style={$patientsText}
          >
          {
          // title.MRNNo + ' | ' +
           title.Gender + ' | ' + ageCalculator(title.DOB)}
        </Text>
        {title.Services.map((item)=>{return (
          
          <View style={$serviceItem}>
            <Text testID="login-heading" 
              style={$patientsText}
            >
              {item.ServiceName }
            </Text>
            <Text testID="login-heading" 
              style={$patientsText}
            >
              {item.Charges }
            </Text>
          </View>
        )})}

        
      </View>
)

  function patientItemPress(title: React.SetStateAction<string>) {
    console.log('-=-=-=-=-=-=-=-=-', title)
    console.log('-=-=-=-=-=-=-=-=-', patient)
    setPatient(title)
  }

  function addNewPress() {
    navigation.navigate("Profile")
  }

  function advanceSearchPress(){
    navigation.navigate("Patient")
  }

    return (
      <>
      {console.log('inside patient queue screen....', patientQueueForList())}
      <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        {/* <Text preset="heading" tx="todaysPatientsScreen.todaysPatients" style={$title} /> */}
        <View style={$patientsListView}>
          <FlatList
            data={patientQueueForList()}
            // style={$patientsListView}
            extraData={patientQueueForList()}
            renderItem={({item}) => <PatientItem title={item} />}
            keyExtractor={item => item.PatientId}
          />
        </View>
     
      </Screen>
      </>
    )
  }

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
}

const $title: TextStyle = {
  flex: 0.5,
  marginBottom: spacing.sm,
}

const $patientsListView: ViewStyle = {
  flex: 6,
  // borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  marginVertical: spacing.sm,
  borderRadius: 10,
  elevation: 5,
  backgroundColor: colors.background
}

const $patientsText: TextStyle = {
  // padding: spacing.sm,
}

const $buttonsView: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  // alignSelf: 'baseline',
  // position: 'absolute',
  // bottom: 20,
  width: '100%',
}

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
}

const $patientItemView: ViewStyle = {
  elevation: 8,
  marginVertical: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 10,
}

const $patientItemTitleView: ViewStyle = {
  // borderWidth: 0.5,
  position: 'absolute',
  backgroundColor: colors.palette.accent500,
  top: -spacing.sm,
  start: spacing.sm,
  borderRadius: 25,
  paddingHorizontal: spacing.sm,
  alignItems: 'center',
  justifyContent: 'center'
}

const $patientTitleText: TextStyle = {
  // paddingHorizontal: spacing.sm
}

const $serviceItem: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: colors.palette.accent200,
  margin: '2%',
  paddingHorizontal: '4%',
  borderRadius: 5
}
// @home remove-file
