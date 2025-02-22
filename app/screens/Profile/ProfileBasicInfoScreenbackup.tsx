import React, { FC, useState } from "react"
import { TouchableOpacity, Image, ImageStyle, TextStyle, View, ViewStyle, FlatList } from "react-native"
import { Button, ListItem, TextField, Screen, Text } from "../../components"
import { HomeTabScreenProps } from "../../navigators/HomeNavigator"
import { PatientStackScreenProps } from "../../navigators/PatientNavigator"
import { spacing, colors } from "../../theme"
import { openLinkInBrowser } from "../../utils/openLinkInBrowser"
import { isRTL } from "../../i18n"
import DropDownPicker from 'react-native-dropdown-picker';

const PATIENTS = [
  {
    patientId: 1,
    patientName: 'Patient 1'
  },
  {
    patientId: 2,
    patientName: 'Patient 2'
  },
  {
    patientId: 3,
    patientName: 'Patient 3'
  },
  {
    patientId: 4,
    patientName: 'Patient 4'
  },
  {
    patientId: 5,
    patientName: 'Patient 5'
  },
  {
    patientId: 6,
    patientName: 'Patient 6'
  },
  {
    patientId: 7,
    patientName: 'Patient 7'
  },
  {
    patientId: 8,
    patientName: 'Patient 8'
  },
  {
    patientId: 9,
    patientName: 'Patient 9'
  },
  {
    patientId: 10,
    patientName: 'Patient 10'
  },
  {
    patientId: 11,
    patientName: 'Patient 11'
  },
  {
    patientId: 12,
    patientName: 'Patient 12'
  },
  {
    patientId: 13,
    patientName: 'Patient 13'
  },
  {
    patientId: 14,
    patientName: 'Patient 14'
  },
  {
    patientId: 15,
    patientName: 'Patient 15'
  },
  {
    patientId: 16,
    patientName: 'Patient 13'
  },
  {
    patientId: 17,
    patientName: 'Patient 14'
  },
  {
    patientId: 18,
    patientName: 'Patient 15'
  },
]

const CITIES = [
  {
    cityId: 1,
    label: 'City 1',
    value: 'City 1'
  },
  {
    cityId: 2,
    label: 'City 2',
    value: 'City 2'
  },
  {
    cityId: 3,
    label: 'City 3',
    value: 'City 3'
  },
  {
    cityId: 4,
    label: 'City 4',
    value: 'City 4'
  },
  {
    cityId: 5,
    label: 'City 5',
    value: 'City 5'
  },
  {
    cityId: 6,
    label: 'City 6',
    value: 'City 6'
  }
]

const GENDER = [
  {
    id: 1,
    label: 'Male',
    value: 'Male'
  },
  {
    id: 2,
    label: 'Female',
    value: 'Female'
  },
  {
    id: 3,
    label: 'Other',
    value: 'Other'
  },
]

export const ProfileBasicInfoScreen: FC<PatientStackScreenProps<"PatientAdvanceSearch">> =
  function ProfileBasicInfoScreen(_props) {

    const [mrn, setMrn] = useState('')
    const [fName, setFname] = useState('')
    const [lName, setLname] = useState('')

    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [city, setCity] = useState([]);

    const [fDate, setFdate] = useState('')
    const [toDate, setTodate] = useState('')

    const [cellNo, setCellNo] = useState('')
    const [cnic, setCnic] = useState('')

    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [gender, setGender] = useState([]);

    const [patient, setPatient] = useState('')


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
    return (
      <Screen preset="scroll" contentContainerStyle={$container}
      //  safeAreaEdges={["top"]}
       >
        <Text preset="heading" tx="profileBasicInfoScreen.basicInfo" style={$title} />
      
        <View style={$fieldsView}>
        <View style={$fieldRowView}>
          <TextField
            value={mrn}
            onChangeText={setMrn}
            containerStyle={$textField}
            autoCapitalize="none"
            // autoComplete="email"
            autoCorrect={false}
            keyboardType="numeric"
            labelTx="patientAdvanceSearchScreen.mrn"
            placeholderTx="patientAdvanceSearchScreen.mrn"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
          <TextField
            value={fName}
            onChangeText={setFname}
            containerStyle={$textField}
            autoCapitalize="none"
            // autoComplete="email"
            autoCorrect={false}
            keyboardType="default"
            labelTx="patientAdvanceSearchScreen.fname"
            placeholderTx="patientAdvanceSearchScreen.fname"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
        </View>
        <View style={$fieldRowView}>
          <TextField
            value={lName}
            onChangeText={setLname}
            containerStyle={$textField}
            autoCapitalize="none"
            // autoComplete="email"
            autoCorrect={false}
            keyboardType="numeric"
            labelTx="patientAdvanceSearchScreen.lname"
            placeholderTx="patientAdvanceSearchScreen.lname"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
          <View style={$dropdownView}>
          <DropDownPicker
            open={cityDropdownOpen}
            value={city}
            items={CITIES}
            setOpen={setCityDropdownOpen}
            setValue={setCity}
            // setItems={setItems}

            // theme="DARK"
            // multiple={true}
            // mode="BADGE"
            // badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
          />
          </View>
        </View>
        <View style={$fieldRowView}>
          <TextField
            value={fDate}
            onChangeText={setFdate}
            containerStyle={$textField}
            autoCapitalize="none"
            // autoComplete="email"
            autoCorrect={false}
            keyboardType="numeric"
            labelTx="patientAdvanceSearchScreen.fDate"
            placeholderTx="patientAdvanceSearchScreen.fDate"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
          <TextField
            value={toDate}
            onChangeText={setTodate}
            containerStyle={$textField}
            autoCapitalize="none"
            // autoComplete="email"
            autoCorrect={false}
            keyboardType="default"
            labelTx="patientAdvanceSearchScreen.toDate"
            placeholderTx="patientAdvanceSearchScreen.toDate"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
        </View>
        <View style={$fieldRowView}>
          <TextField
            value={cellNo}
            onChangeText={setCellNo}
            containerStyle={$textField}
            autoCapitalize="none"
            // autoComplete="email"
            autoCorrect={false}
            keyboardType="numeric"
            labelTx="patientAdvanceSearchScreen.cellNo"
            placeholderTx="patientAdvanceSearchScreen.cellNo"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
          <TextField
            value={cnic}
            onChangeText={setCnic}
            containerStyle={$textField}
            autoCapitalize="none"
            // autoComplete="email"
            autoCorrect={false}
            keyboardType="default"
            labelTx="patientAdvanceSearchScreen.cnic"
            placeholderTx="patientAdvanceSearchScreen.cnic"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
        </View>
        <View style={$fieldRowView}>
          <View style={$dropdownView}>
            <DropDownPicker
              open={genderDropdownOpen}
              value={gender}
              items={GENDER}
              setOpen={setGenderDropdownOpen}
              setValue={setGender}
              // setItems={setItems}

              // theme="DARK"
              // multiple={true}
              // mode="BADGE"
              // badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
            />
          </View>
          <TextField
            value={lName}
            onChangeText={setLname}
            containerStyle={$textField}
            autoCapitalize="none"
            // autoComplete="email"
            autoCorrect={false}
            keyboardType="numeric"
            labelTx="patientAdvanceSearchScreen.lname"
            placeholderTx="patientAdvanceSearchScreen.lname"
            // onSubmitEditing={() => authPasswordInput.current?.focus()}
          />
         
        </View>
        </View>
        <View style={$buttonView}>
          <Button
            testID="login-button"
            tx={'patientAdvanceSearchScreen.search'}
            style={$tapButton}
            preset="reversed"
            // onPress={key == '2' || '3' ? login : login}
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
  flex: 0.5,
  marginBottom: spacing.sm,
}

const $fieldsView: ViewStyle = {
  flex: 6,
 
}

const $patientsText: TextStyle = {
  padding: spacing.sm,
}

const $buttonView: ViewStyle = {
  flex: 1,
  alignItems: 'center'
}
const $tapButton: ViewStyle = {
  width: '80%'
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
  width: '40%'
}

const $fieldRowView: ViewStyle = {
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-around'
}

const $dropdownView: ViewStyle = {
  width: '40%',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
  backgroundColor: colors.background,
  // paddingHorizontal: 15
}

// @home remove-file
