import React, {FC, useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {toJS} from 'mobx';
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
export const EditProfileBasicInfoScreen: FC<
  ProfileStackScreenProps<'EditProfileBasicInfoScreen'>
> = function EditProfileBasicInfoScreen(_props) {
  const {navigation} = _props;
  const route = useRoute();
  const {patientIndex, patientData} = route.params;
  // const {patientData} = route.params;
  // const patientData = patientQueueForList()[patientIndex];
  const {pickerStore, patientStore, newPatientStore, siteStore} = useStores();
  const {
    getGenderForList,
    getMaritalStatusForList,
    getRacesForList,
    getPatientRelationshipForList,
    getReligionsForList,
    getLanguagesForList,
  } = pickerStore;

  const {addNewPatient, latestIndex, update} = newPatientStore;

  console.log('data in picker store....', pickerStore);
  console.log('data in picker store....', pickerStore.getMaritalStatusForList);

  const [fName, setFname] = useState('');
  const [lName, setLname] = useState('');

  const [genderItems, setGenderItems] = useState(getGenderForList);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [gender, setGender] = useState('');

  const [meritalStatusItems, setMeritalStatusItems] = useState(
    getMaritalStatusForList,
  );
  const [meritalStatusDropdownOpen, setMeritalStatusDropdownOpen] =
    useState(false);
  const [meritalStatus, setMeritalStatus] = useState('');

  // const [dob, setDob] = useState(new Date());
  const [dob, setDob] = useState<Date | null>(null);

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
  // function parseNonISODateString(dateString) {
  //   if (!dateString) return null;

  //   const parts = dateString.split(/[\s/:]+/); // split by space, slash, colon
  //   const [month, day, year, hour, minute, second, period] = parts;

  //   let h = parseInt(hour, 10);
  //   if (period === 'PM' && h !== 12) h += 12;
  //   if (period === 'AM' && h === 12) h = 0;

  //   return new Date(year, parseInt(month, 10) - 1, day, h, minute, second);
  // }
  // function parseNonISODateString(dateString) {
  //   if (!dateString) return null;

  //   // Split by space
  //   const [datePart, timePart, period] = dateString.split(' ');

  //   if (!datePart || !timePart || !period) {
  //     console.error('Invalid date format:', dateString);
  //     return new Date(NaN);
  //   }

  //   const [day, month, year] = datePart.split('/').map(Number);
  //   const [hourStr, minuteStr, secondStr] = timePart.split(':');

  //   let hour = parseInt(hourStr, 10);
  //   const minute = parseInt(minuteStr, 10);
  //   const second = parseInt(secondStr, 10);

  //   // Handle AM/PM
  //   if (period === 'PM' && hour < 12) hour += 12;
  //   if (period === 'AM' && hour === 12) hour = 0;

  //   return new Date(year, month - 1, day, hour, minute, second);
  // }
  function parseNonISODateString(dateString) {
    if (!dateString) return null;

    // ✅ Check if it's a valid ISO date
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) {
      console.log('✅ Detected ISO date format');
      return isoDate;
    }

    // Fallback for non-ISO (e.g. DD/MM/YYYY HH:mm:ss AM/PM)
    const [datePart, timePart, period] = dateString.split(' ');

    if (!datePart || !timePart || !period) {
      console.error('❌ Invalid date format:', dateString);
      return new Date(NaN);
    }

    const [day, month, year] = datePart.split('/').map(Number);
    const [hourStr, minuteStr, secondStr] = timePart.split(':');

    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const second = parseInt(secondStr, 10);

    // AM/PM conversion
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, minute, second);
  }

  useEffect(() => {
    if (patientData) {
      setFname(patientData.FirstName || '');
      setLname(patientData.LastName || '');
      // Safe DOB parsing
      const rawDob = parseNonISODateString(patientData.DOB);
      const isValidDob = rawDob instanceof Date && !isNaN(rawDob.getTime());
      // Direct ISO DOB parsing
      // const rawDob = new Date(patientData.DOB);
      // const isValidDob = rawDob instanceof Date && !isNaN(rawDob.getTime());
      console.log('DOB:', patientData.DOB);
      console.log('Parsed DOB:', rawDob);
      if (isValidDob) {
        console.log('✅ Parsed DOB:', rawDob.toISOString());
        setDob(rawDob);
      } else {
        console.log('❌ Invalid DOB:', patientData.DOB);
        setDob(null); // fallback for safety
      }

      setMrn(patientData.MRNNo || '');
      setGender(patientData.Gender || '');
      setMeritalStatus([patientData.MartialStatus] || []);
      setEthnicity([patientData.Ethnicity] || []);
      setRelationship([patientData.RelationToPatient] || []);
      setNameOfRelative(patientData.NameOfRelative || '');
      setReligion([patientData.Religion] || []);
      setSpokenTongue([patientData.SpokenTongue] || []);
    }
  }, [patientData]);

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
    // const mrno = '01-01-' + getRandomNumber() + lastIndex + 1;
    const mrno =
      patientData?.MRNNo || '01-01-' + getRandomNumber() + lastIndex + 1;

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
      isUserAdded: true,
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
      isUserAdded: true,
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
    console.log('Updated Patient....', patient);
    console.log('Updated Patient', newPatient);

    // newPatientStore.addNewPatient(newPatient);
    // patientStore.addNewPatient(patient);
    newPatientStore.updateNewPatient(patientIndex, {
      FirstName: fName,
      LastName: lName,
      MRNNo: mrno,
      DOB: dob.toDateString(),
      CNIC: cnic,
      // CellPhoneNumber: phone,
      // Address: address,
      // Country: country,
      // Province: province,
      // City: city,
    });
    console.log('Updated Patient:', newPatientStore.updateNewPatients);
    console.log('Updated Patient:', newPatientStore.newPatients.toJSON());
    navigation.navigate('EditProfileAddressScreen', {
      patientIndex: patientIndex,
      patientData: {
        ...patientData,
        FirstName: fName,
        LastName: lName,
        MRNNo: mrno,
        DOB: dob.toDateString(),
        CNIC: cnic,
        // CellPhoneNumber: phone,
        // Address: address,
        // Country: country,
        // Province: province,
        // City: city,
      },
    });
  }

  const profilePress = () => {
    // console.log('Profile pressed.......')
  };
  console.log('Received patientData:', patientData);
  console.log('Recieved Index:', patientIndex);
  return (
    <>
      <Header
        LeftActionComponent={
          <HeaderBackButton
            {...{
              title: 'EditProfileBasicInfoScreen.basicInfo',
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
          tx="EditProfileBasicInfoScreen.basicInfo"
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
                multiple={false}
                open={genderDropdownOpen}
                value={gender[0]}
                items={genderItems}
                setOpen={setGenderDropdownOpen}
                setValue={callback => {
                  const val = callback(gender[0]);
                  setGender([val]); // Always keep it in an array if you follow that convention
                }}
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
                multiple={false}
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
              // value={dob && !isNaN(dob.getTime()) ? dob.toDateString() : ''}
              value={
                dob instanceof Date && !isNaN(dob.getTime())
                  ? dob.toDateString()
                  : ''
              }
              containerStyle={$textField}
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              labelTx="profileBasicInfoScreen.dob"
              placeholderTx="profileBasicInfoScreen.dob"
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
                multiple={false}
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
                multiple={false}
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
                multiple={false}
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
                multiple={false}
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
