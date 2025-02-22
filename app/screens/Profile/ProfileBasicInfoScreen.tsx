import React, {FC, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {
  Button,
  ListItem,
  TextField,
  Screen,
  Text,
  Header,
} from '../../components';
import {HomeTabScreenProps} from '../../navigators/HomeNavigator';
import {PatientStackScreenProps} from '../../navigators/PatientNavigator';
import {spacing, colors} from '../../theme';
import {openLinkInBrowser} from '../../utils/openLinkInBrowser';
import {isRTL} from '../../i18n';
import DropDownPicker from 'react-native-dropdown-picker';
import {ProfileStackScreenProps} from 'app/navigators/ProfileNavigator';
import {useStores} from 'app/models';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {ServiceModel} from 'app/models/Service';
import {HeaderBackButton} from '../HomeScreen/HeaderBackButton';
import {ProfileIconButton} from '../HomeScreen/ProfileIconButton';
import {format} from 'date-fns';

const CITIES = [
  {
    cityId: 1,
    label: 'City 1',
    value: 'City 1',
  },
  {
    cityId: 2,
    label: 'City 2',
    value: 'City 2',
  },
  {
    cityId: 3,
    label: 'City 3',
    value: 'City 3',
  },
  {
    cityId: 4,
    label: 'City 4',
    value: 'City 4',
  },
  {
    cityId: 5,
    label: 'City 5',
    value: 'City 5',
  },
  {
    cityId: 6,
    label: 'City 6',
    value: 'City 6',
  },
];

const GENDER = [
  {
    id: 1,
    label: 'Male',
    value: 'Male',
  },
  {
    id: 2,
    label: 'Female',
    value: 'Female',
  },
  {
    id: 3,
    label: 'Other',
    value: 'Other',
  },
];

const MERITAL_STATUS = [
  {
    id: 1,
    label: 'Married',
    value: 'Married',
  },
  {
    id: 2,
    label: 'Unmarried',
    value: 'Unmarried',
  },
  {
    id: 3,
    label: 'Other',
    value: 'Other',
  },
];

const ETHNICITY = [
  {
    id: 1,
    label: 'Punjabi',
    value: 'Punjabi',
  },
  {
    id: 2,
    label: 'Muhajir',
    value: 'Muhajir',
  },
  {
    id: 3,
    label: 'Sindhi',
    value: 'Sindhi',
  },
  {
    id: 4,
    label: 'Other',
    value: 'Other',
  },
];

const RELATIONSHIP = [
  {
    id: 1,
    label: 'Brother',
    value: 'Brother',
  },
  {
    id: 2,
    label: 'Father',
    value: 'Father',
  },
  {
    id: 3,
    label: 'Mother',
    value: 'Mother',
  },
  {
    id: 4,
    label: 'Sister',
    value: 'Sister',
  },
];

const RELIGION = [
  {
    id: 1,
    label: 'Islam',
    value: 'Islam',
  },
  {
    id: 2,
    label: 'Christian',
    value: 'Christian',
  },
  {
    id: 3,
    label: 'Buddhist',
    value: 'Buddhist',
  },
  {
    id: 4,
    label: 'Sikh',
    value: 'Sikh',
  },
];

const MOTHER_TONGUE = [
  {
    id: 1,
    label: 'Punjabi',
    value: 'Punjabi',
  },
  {
    id: 2,
    label: 'Pashto',
    value: 'Pashto',
  },
  {
    id: 3,
    label: 'Siraiki',
    value: 'Siraiki',
  },
  {
    id: 4,
    label: 'Sindhi',
    value: 'Sindhi',
  },
];

const newDate = new Date();
export const ProfileBasicInfoScreen: FC<
  ProfileStackScreenProps<'ProfileBasicInfoScreen'>
> = function ProfileBasicInfoScreen(_props) {
  const {navigation} = _props;

  const {pickerStore, patientStore, newPatientStore, siteStore} = useStores();
  const {
    getGenderForList,
    getMaritalStatusForList,
    getRacesForList,
    getPatientRelationshipForList,
    getReligionsForList,
    getLanguagesForList,
  } = pickerStore;

  const {addNewPatient, latestIndex} = newPatientStore;

  console.log('data in picker store....', pickerStore);
  console.log('data in picker store....', pickerStore.getMaritalStatusForList);

  const [fName, setFname] = useState('');
  const [lName, setLname] = useState('');

  const [genderItems, setGenderItems] = useState(getGenderForList);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [gender, setGender] = useState([]);

  const [meritalStatusItems, setMeritalStatusItems] = useState(
    getMaritalStatusForList,
  );
  const [meritalStatusDropdownOpen, setMeritalStatusDropdownOpen] =
    useState(false);
  const [meritalStatus, setMeritalStatus] = useState([]);

  const [dob, setDob] = useState(new Date());

  const [ethnicityItems, setEthnicityItems] = useState(getRacesForList);
  const [ethnicityDropdownOpen, setEthnicityDropdownOpen] = useState(false);
  const [ethnicity, setEthnicity] = useState([]);

  const [patientRelationshipItems, setpatientRelationshipItems] = useState(
    getPatientRelationshipForList,
  );
  const [relationshipDropdownOpen, setRelationshipDropdownOpen] =
    useState(false);
  const [relationship, setRelationship] = useState([]);

  const [nameOfRelative, setNameOfRelative] = useState('');

  const [religionsItems, setReligionsItems] = useState(getReligionsForList);
  const [religionDropdownOpen, setReligionDropdownOpen] = useState(false);
  const [religion, setReligion] = useState([]);

  const [languagesItem, setLanguagesItem] = useState(getLanguagesForList);
  const [spokenTongueDropdownOpen, setSpokenTongueDropdownOpen] =
    useState(false);
  const [spokenTongue, setSpokenTongue] = useState([]);

  const [mrn, setMrn] = useState('');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [city, setCity] = useState([]);

  const [toDate, setTodate] = useState('');

  const [cellNo, setCellNo] = useState('');
  const [cnic, setCnic] = useState('');

  const [patient, setPatient] = useState('');

  const PatientItem = ({title}) => (
    <View>
      <Text testID="login-heading" preset="bold" style={$patientsText}>
        {title}
      </Text>
    </View>
  );

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDob(currentDate);
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: dob,
      onChange,
      mode: currentMode,
      is24Hour: true,
      maximumDate: newDate,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  function patientItemPress(title: React.SetStateAction<string>) {
    console.log('-=-=-=-=-=-=-=-=-', title);
    console.log('-=-=-=-=-=-=-=-=-', patient);
    setPatient(title);
  }

  const getRandomNumber = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  function save() {
    const lastIndex = latestIndex();
    const mrno = '01-01-' + getRandomNumber() + lastIndex + 1;

    if (
      !(
        fName &&
        lName &&
        dob &&
        gender?.length > 0 &&
        meritalStatus?.length > 0
      )
    ) {
      ToastAndroid.show('Please fill all required fields', ToastAndroid.LONG);
      return;
    }

    let _gender = gender + '';
    let genderId =
      getGenderForList.find(item => item.GenderName === _gender)?.GenderId ??
      '';

    let _meritalStatus = meritalStatus + '';
    let meritalStatusId =
      getMaritalStatusForList.find(item => item.Name === _meritalStatus)
        ?.MaritalStatusId ?? '';

    let _patientId = -(lastIndex + getRandomNumber());

    const patient = {
      PatientId: _patientId,
      FirstName: fName + '',
      LastName: lName + '',
      MRNNo: mrno,
      DOB: format(dob, 'dd/MM/yyyy hh:mm:s a') + '',
      CNIC: '',
      CellPhoneNumber: '',
      Gender: genderId.toString(),
      SiteName: siteStore.getSelectedSite()?.SiteName ?? '',
      MartialStatus: meritalStatusId.toString(),
      SpouseName: '',
      ZakatEligible: false,
      Country: '',
      City: '',
      Province: '',
      Address: '',
      EnteredOn: '',
      Services: [],
      Status: '',
      CheckInSynced: false,
    };

    const patient2 = {
      PatientId: 99159,
      FirstName: 'Nazia',
      LastName: 'Atta Muhammad',
      MRNNo: '01-01-0099159',
      DOB: '8/1/2015 12:00:00 AM',
      CNIC: '41406-5776837-4',
      CellPhoneNumber: '03079339798',
      Gender: 'Female',
      SiteName: 'Gharo',
      MartialStatus: 'Single',
      SpouseName: 'Atta Muhammad',
      ZakatEligible: false,
      Country: 'Pakistan',
      City: 'Thatta',
      Province: 'Sindh',
      Address: 'Lait Stop',
      EnteredOn: '2023-10-03T14:11:13.133',
    };
    const newPatient = {
      PatientId: _patientId,
      FirstName: fName,
      LastName: lName,
      MRNNo: '01-01-000' + latestIndex(),
      DOB: dob.toDateString(),
      CNIC: '',
      CellPhoneNumber: '',
      Gender: gender + '',
      SiteName: '',
      MartialStatus: meritalStatus + '',
      SpouseName: '',
      ZakatEligible: false,
      Country: '',
      City: '',
      Province: '',
      Address: '',
      EnteredOn: '',
      Services: [],
      Status: '',
      CheckInSynced: false,

      Ethnicity: ethnicity + '',
      RelationToPatient: relationship + '',
      NameOfRelative: nameOfRelative + '',
      Religion: religion + '',
      SpokenTongue: spokenTongue + '',

      TelephoneNo: '',
      MobileNo2: '',
      EmergencyRelation: '',
      EmergencyRelationName: '',
      EmergencyRelationContact: '',
    };
    console.log('Selected Gender....', patient);
    console.log('Selected Gender....', newPatient);

    newPatientStore.addNewPatient(newPatient);
    patientStore.addNewPatient(patient);
    navigation.navigate('ProfileAddressScreen');
  }

  const profilePress = () => {
    // console.log('Profile pressed.......')
  };

  return (
    <>
      <Header
        LeftActionComponent={
          <HeaderBackButton
            {...{
              title: 'profileBasicInfoScreen.basicInfo',
              navigation: navigation,
            }}
          />
        }
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
      />
      <Screen
        preset="scroll"
        //  safeAreaEdges={["top"]}
        contentContainerStyle={$container}>
        <Text
          preset="default"
          tx="profileBasicInfoScreen.basicInfo"
          style={$title}
        />
        <View style={$fieldsView}>
          <View style={$fieldRowView}>
            <TextField
              value={fName}
              onChangeText={setFname}
              containerStyle={$textField}
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
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
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              autoCapitalize="none"
              // autoComplete="email"
              autoCorrect={false}
              keyboardType="default"
              labelTx="patientAdvanceSearchScreen.lname"
              placeholderTx="patientAdvanceSearchScreen.lname"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
          </View>
          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'GenderName',
                  value: 'GenderName',
                }}
                placeholder="Gender"
                listMode="MODAL"
                open={genderDropdownOpen}
                value={gender}
                items={genderItems}
                setOpen={setGenderDropdownOpen}
                setValue={setGender}
              />
            </View>
          </View>
          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'Name',
                  value: 'Name',
                }}
                placeholder="Marital Status"
                open={meritalStatusDropdownOpen}
                value={meritalStatus}
                items={meritalStatusItems}
                setOpen={setMeritalStatusDropdownOpen}
                setValue={setMeritalStatus}
                listMode="MODAL"
                // setItems={setItems}
                // theme="DARK"
                // multiple={true}
                // mode="BADGE"
                // badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
              />
            </View>
          </View>
          <TouchableOpacity onPress={showDatepicker} style={$fieldRowView}>
            <TextField
              editable={false}
              value={dob ? dob.toDateString() : ''}
              // onChangeText={setDob}
              containerStyle={$textField}
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              autoCapitalize="none"
              // autoComplete="email"
              autoCorrect={false}
              keyboardType="numeric"
              labelTx="profileBasicInfoScreen.dob"
              placeholderTx="profileBasicInfoScreen.dob"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
          </TouchableOpacity>
          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'Name',
                  value: 'Name',
                }}
                placeholder="Ethinicity"
                open={ethnicityDropdownOpen}
                value={ethnicity}
                items={ethnicityItems}
                setOpen={setEthnicityDropdownOpen}
                setValue={setEthnicity}
                listMode="MODAL"
              />
            </View>
          </View>
          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'RelationShipName',
                  value: 'RelationShipName',
                }}
                placeholder="Relationship to Patient"
                open={relationshipDropdownOpen}
                value={relationship}
                items={patientRelationshipItems}
                setOpen={setRelationshipDropdownOpen}
                setValue={setRelationship}
                listMode="MODAL"
              />
            </View>
          </View>
          <View style={$fieldRowView}>
            <TextField
              value={nameOfRelative}
              onChangeText={setNameOfRelative}
              containerStyle={$textField}
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              autoCapitalize="none"
              // autoComplete="email"
              autoCorrect={false}
              keyboardType="default"
              labelTx="profileBasicInfoScreen.nameOfRelative"
              placeholderTx="profileBasicInfoScreen.nameOfRelative"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
          </View>
          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'Name',
                  value: 'Name',
                }}
                placeholder="Religion"
                open={religionDropdownOpen}
                value={religion}
                items={religionsItems}
                setOpen={setReligionDropdownOpen}
                setValue={setReligion}
                listMode="MODAL"
              />
            </View>
          </View>
          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'Name',
                  value: 'Name',
                }}
                placeholder="Spoken Tongue"
                open={spokenTongueDropdownOpen}
                value={spokenTongue}
                items={languagesItem}
                setOpen={setSpokenTongueDropdownOpen}
                setValue={setSpokenTongue}
                listMode="MODAL"
              />
            </View>
          </View>
        </View>

        <View style={$buttonView}>
          <Button
            testID="login-button"
            tx={'profileBasicInfoScreen.save'}
            style={$tapButton}
            preset="reversed"
            onPress={save}
          />
        </View>
      </Screen>
    </>
  );
};

const $container: ViewStyle = {
  // paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.xxl,
  paddingHorizontal: spacing.lg,
};

const $title: TextStyle = {
  // flex: 0.5,
  backgroundColor: 'lightgray',
  width: '100%',
  paddingHorizontal: spacing.xs,
  margin: spacing.sm,
};

const $fieldsView: ViewStyle = {
  flex: 6,
};

const $patientsText: TextStyle = {
  padding: spacing.sm,
};

const $buttonView: ViewStyle = {
  flex: 1,
  alignItems: 'center',
};
const $tapButton: ViewStyle = {
  width: '80%',
  backgroundColor: colors.themeText,
};

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
  width: '80%',
};

const $fieldRowView: ViewStyle = {
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-around',
};

const $dropdownView: ViewStyle = {
  width: '80%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.background,
  marginBottom: spacing.lg,
  zIndex: 10,
  // paddingHorizontal: 15
};

// @home remove-file
