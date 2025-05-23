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
import {useRoute} from '@react-navigation/native';

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

const PROVINCES = [
  {
    id: 1,
    label: 'Punjab',
    value: 'Punjab',
  },
  {
    id: 2,
    label: 'Sindh',
    value: 'Sindh',
  },
  {
    id: 3,
    label: 'Balochistan',
    value: 'Balochistan',
  },
  {
    id: 4,
    label: 'KPK',
    value: 'KPK',
  },
];

const DISTRICTS = [
  {
    id: 1,
    label: 'Lahore',
    value: 'Lahore',
  },
  {
    id: 2,
    label: 'Qasur',
    value: 'Qasur',
  },
  {
    id: 3,
    label: 'Sheikhupura',
    value: 'Sheikhupura',
  },
];

export const EditProfileContactScreen: FC<
  ProfileStackScreenProps<'EditProfileContactScreen'>
> = function EditProfileContactScreen(_props) {
  const {navigation} = _props;
  const route = useRoute();
  const patientIndex = route.params?.patientIndex ?? 0;
  const patientData = route.params?.patientData ?? {};
  const [telephoneNo, setTelephoneNo] = useState(
    patientData?.telephoneNo || '',
  );
  // const [telephoneNo, setTelephoneNo] = useState('');
  const [mobileNo1, setMobileNo1] = useState(patientData?.mobileNo1 || '');
  // const [mobileNo1, setMobileNo1] = useState('');
  const [mobileNo2, setMobileNo2] = useState(patientData?.mobileNo2 || '');
  // const [mobileNo2, setMobileNo2] = useState('');

  const {pickerStore, patientStore, newPatientStore} = useStores();
  const {
    addNewPatient,
    latestIndex,
    newPatientsForList,
    addContactToNewPatient,
  } = newPatientStore;
  useEffect(() => {
    if (patientData) {
      setTelephoneNo(patientData.TelephoneNo || '');
      setMobileNo1(patientData.MobileNo1 || '');
      setMobileNo2(patientData.MobileNo2 || '');
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

  function save() {
    // if (!telephoneNo || !mobileNo1 || !mobileNo2) {
    //   ToastAndroid.show('Please fill all contact fields', ToastAndroid.SHORT);
    //   console.log('Please fill all contact fields');
    //   return;
    // }

    newPatientStore.updateNewPatient(patientIndex, {
      TelephoneNo: telephoneNo,
      CellPhoneNumber: mobileNo1, // <-- Corrected key
      MobileNo2: mobileNo2,
    });

    ToastAndroid.show('Contact Info Updated', ToastAndroid.SHORT);
    console.log('Contact Info Updated:', {
      TelephoneNo: telephoneNo,
      CellPhoneNumber: mobileNo1,
      MobileNo2: mobileNo2,
    });

    navigation.navigate('EditProfileEmergencyContact', {
      patientIndex,
      patientData: {
        ...patientData,
        TelephoneNo: telephoneNo,
        CellPhoneNumber: mobileNo1,
        MobileNo2: mobileNo2,
      },
    });
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
              title: 'EditContactInfoScreen.contactInfo',
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
          tx="EditContactInfoScreen.contactInfo"
          style={$title}
        />
        <View style={$fieldsView}>
          <View style={$fieldRowView}>
            <TextField
              value={telephoneNo}
              onChangeText={setTelephoneNo}
              containerStyle={$textField}
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              autoCapitalize="none"
              // autoComplete="email"
              autoCorrect={false}
              keyboardType="numeric"
              labelTx="contactInfoScreen.telephoneNo"
              placeholderTx="contactInfoScreen.telephoneNo"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
          </View>

          <View style={$fieldRowView}>
            <TextField
              value={mobileNo1}
              onChangeText={setMobileNo1}
              containerStyle={$textField}
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              autoCapitalize="none"
              // autoComplete="email"
              autoCorrect={false}
              keyboardType="numeric"
              labelTx="contactInfoScreen.mobileNo1"
              placeholderTx="contactInfoScreen.mobileNo1"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
          </View>

          <View style={$fieldRowView}>
            <TextField
              value={mobileNo2}
              onChangeText={setMobileNo2}
              containerStyle={$textField}
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              autoCapitalize="none"
              // autoComplete="email"
              autoCorrect={false}
              keyboardType="numeric"
              labelTx="contactInfoScreen.mobileNo2"
              placeholderTx="contactInfoScreen.mobileNo2"
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
