import React, {FC, useState, useEffect} from 'react';
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
import {ProfileStackScreenProps} from 'app/navigators';
import {useStores} from 'app/models';
import {HeaderBackButton} from '../HomeScreen/HeaderBackButton';
import {ProfileIconButton} from '../HomeScreen/ProfileIconButton';
import {CommonActions} from '@react-navigation/native';
import {mmkvStorage} from 'app/models/AuthenticationStore';
import {useRoute} from '@react-navigation/native';
import {ServiceStore} from '../../models/ServiceStore';
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

export const EditEmergencyContact: FC<
  ProfileStackScreenProps<'EditEmergencyContact'>
> = function EditEmergencyContact(_props) {
  const {navigation} = _props;
  const route = useRoute();
  const {serviceStore} = useStores();
  console.log('UseStores:', useStores());
  // const route = useRoute();
  // const {patientIndex, patientData} = route.params;
  const patientIndex = route.params?.patientIndex ?? 0;
  const patientData = route.params?.patientData ?? {};

  const {pickerStore, patientStore, newPatientStore} = useStores();
  const {
    addNewPatient,
    latestIndex,
    newPatientsForList,
    addEmergencyContactToNewPatient,
    getNewPatient,
  } = newPatientStore;

  const [relationshipItems, setRelationshipItems] = useState(
    pickerStore.getRelationshipForList,
  );
  const [relationshipDropdownOpen, setRelationshipDropdownOpen] =
    useState(false);
  // const [relationship, setRelationship] = useState([]);
  const [relationship, setRelationship] = useState(
    patientData?.relationship ?? '',
  );

  // const [name, setName] = useState('');
  const [name, setName] = useState(patientData?.name ?? '');

  // const [contact, setContact] = useState('');
  const [contact, setContact] = useState(patientData?.contact ?? '');

  useEffect(() => {
    if (patientData) {
      console.log('Patient Data Recieved in Emergency screen:', patientData);
      setRelationship(patientData.relationship || '');
      setName(patientData.name || '');
      setContact(patientData.contact || '');
      console.log('Patient Data:', patientData);
    }
  }, [patientData]);
  const PatientItem = ({title}) => (
    <View>
      <Text testID="login-heading" preset="bold" style={$patientsText}>
        {title}
      </Text>
    </View>
  );

  function patientItemPress(title: React.SetStateAction<string>) {
    console.log('-=-=-=-=-=-=-=-=-', title);
    console.log('-=-=-=-=-=-=-=-=-', patient);
    setPatient(title);
  }

  // function save() {
  //   console.log('-=-=-=-=-=--=-=-=-=', newPatientsForList);
  //   console.log('-=-=-=-=-=--=-=-=-=', patientStore.patientsForList);
  //   console.log('-=-=-=-=-=--=-=-=-=3', latestIndex());

  //   const index = latestIndex() > 0 ? latestIndex() - 1 : 0;
  //   console.log('-=-=-=-=-=--=-=-=-=4', index);
  //   console.log('-=-=-=-=-=--=-=-=-=5', patientStore.latestIndex());
  //   const patientIndex =
  //     patientStore.latestIndex() > 0 ? patientStore.latestIndex() - 1 : 0;

  //   addEmergencyContactToNewPatient(
  //     relationship + '',
  //     name + '',
  //     contact + '',
  //     index,
  //   );
  //   let prev = mmkvStorage.getString('newPatients');
  //   if (prev) {
  //     mmkvStorage.set(
  //       'newPatients',
  //       JSON.stringify([...JSON.parse(prev), getNewPatient(index)]),
  //     );
  //   } else {
  //     mmkvStorage.set('newPatients', JSON.stringify([getNewPatient(index)]));
  //   }
  //   patientStore.selectNewPatient(patientIndex);
  //   // navigation.navigate('ProfileConsentScreen');
  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 1,
  //       routes: [{name: 'Patient'}],
  //     }),
  //   );
  //   // navigation.reset;
  //   // navigation.navigate('Patient');
  // }
  // function save() {
  //   const updatedPatient = {
  //     ...patientData,
  //     EmergencyContactRelationship: relationship + '',
  //     EmergencyContactName: name + '',
  //     EmergencyContactPhone: contact + '',
  //   };

  //   // Update in MobX store
  //   newPatientStore.updateNewPatient(patientIndex, updatedPatient);

  //   // Also update MMKV
  //   const prev = mmkvStorage.getString('newPatients');
  //   if (prev) {
  //     const parsed = JSON.parse(prev);
  //     parsed[patientIndex] = updatedPatient;
  //     mmkvStorage.set('newPatients', JSON.stringify(parsed));
  //     ToastAndroid.show('Info Updated Successfully', ToastAndroid.SHORT);

  //     console.log('Info Updated Successfully:', updatedPatient);
  //   }

  //   patientStore.selectNewPatient(patientIndex);
  //   // navigation.navigate('ProfileConsentScreen');
  // }
  function save() {
    console.log('Patient Data in save function:', patientData);
    // if (!relationship || !name || !contact) {
    //   ToastAndroid.show(
    //     'Please fill all emergency contact fields',
    //     ToastAndroid.SHORT,
    //   );
    //   return;
    // }
    const service = serviceStore.getServiceById(30756);
    console.log('Service:', service);
    if (!service) {
      console.warn('Service not found!');
      return;
    }

    const updatedPatient = {
      ...patientData,
      EmergencyContactRelationship: relationship,
      EmergencyContactName: name,
      EmergencyContactPhone: contact,
    };

    console.log('hiiii');
    // const sanitizedPatient = {
    // updatedPatient,
    // Services:
    //   updatedPatient.Services?.map(
    //     (service: {ServiceId: any}) => service.ServiceId,
    //   ) ?? [],
    // };

    // Sanitized Data
    const sanitizedPatient = {
      ...updatedPatient,
      Country: String(updatedPatient.Country ?? ''),
      City: String(updatedPatient.City ?? ''),
      Province: String(updatedPatient.Province ?? ''),
      DOB: new Date(updatedPatient.DOB).toISOString(),
    };
    console.log('Sanitized Patient:', sanitizedPatient);
    patientStore.modifyPatient(sanitizedPatient, patientIndex); //...... Error in this line
    console.log('Modified Patient Data:');
    newPatientStore.updateNewPatient(patientIndex, sanitizedPatient);
    console.log('Updated Patient Data index:', patientIndex);
    console.log('Updated Patient Data in save function:', updatedPatient);
    ToastAndroid.show('Emergency Contact Updated', ToastAndroid.SHORT);

    // navigation.navigate('ProfileConsentScreen', {
    //   patientIndex,
    //   patientData: updatedPatient,
    // });

    // Optional: update MMKV if needed
    const prev = mmkvStorage.getString('newPatients');
    if (prev) {
      const parsed = JSON.parse(prev);
      parsed[patientIndex] = updatedPatient;
      mmkvStorage.set('newPatients', JSON.stringify(parsed));
    }
    ToastAndroid.show('Data Updated Successfully', ToastAndroid.SHORT);
    // Go back to Todays Patients screen
    navigation.navigate('TodaysPatients');
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
              title: 'EditEmergencyContactInfo.emergencyContact',
              navigation: navigation,
            }}
          />
        }
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
      />
      <Screen
        preset="scroll"
        contentContainerStyle={$container}
        // safeAreaEdges={["top"]}
      >
        <Text
          preset="default"
          tx="emergencyContactInfo.emergencyContact"
          style={$title}
        />
        <View style={$fieldsView}>
          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'Name',
                  value: 'Name',
                }}
                placeholder="Next of Kin (Relat.)"
                open={relationshipDropdownOpen}
                listMode="MODAL"
                value={relationship}
                items={relationshipItems}
                setOpen={setRelationshipDropdownOpen}
                setValue={setRelationship}
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
              value={name}
              onChangeText={setName}
              containerStyle={$textField}
              autoCapitalize="none"
              // autoComplete="email"
              autoCorrect={false}
              keyboardType="default"
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              labelTx="emergencyContactInfo.nextOfKinName"
              placeholderTx="emergencyContactInfo.nextOfKinName"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
          </View>

          <View style={$fieldRowView}>
            <TextField
              value={contact}
              onChangeText={setContact}
              containerStyle={$textField}
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              autoCapitalize="none"
              // autoComplete="email"
              autoCorrect={false}
              keyboardType="numeric"
              labelTx="emergencyContactInfo.nextOfKinContact"
              placeholderTx="emergencyContactInfo.nextOfKinContact"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
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
  paddingHorizontal: spacing.lg,
  flex: 1,
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
  // paddingHorizontal: 15
};

// @home remove-file
