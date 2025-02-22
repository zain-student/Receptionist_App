import React, {FC, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
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

export const ProfileEmergencyContact: FC<
  ProfileStackScreenProps<'ProfileEmergencyContact'>
> = function ProfileEmergencyContact(_props) {
  const {navigation} = _props;

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
  const [relationship, setRelationship] = useState([]);

  const [name, setName] = useState('');

  const [contact, setContact] = useState('');

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
    console.log('-=-=-=-=-=--=-=-=-=', newPatientsForList);
    console.log('-=-=-=-=-=--=-=-=-=', patientStore.patientsForList);
    console.log('-=-=-=-=-=--=-=-=-=3', latestIndex());

    const index = latestIndex() > 0 ? latestIndex() - 1 : 0;
    console.log('-=-=-=-=-=--=-=-=-=4', index);
    console.log('-=-=-=-=-=--=-=-=-=5', patientStore.latestIndex());
    const patientIndex =
      patientStore.latestIndex() > 0 ? patientStore.latestIndex() - 1 : 0;

    addEmergencyContactToNewPatient(
      relationship + '',
      name + '',
      contact + '',
      index,
    );
    let prev = mmkvStorage.getString('newPatients');
    if (prev) {
      mmkvStorage.set(
        'newPatients',
        JSON.stringify([...JSON.parse(prev), getNewPatient(index)]),
      );
    } else {
      mmkvStorage.set('newPatients', JSON.stringify([getNewPatient(index)]));
    }
    patientStore.selectNewPatient(patientIndex);
    // navigation.navigate('ProfileConsentScreen')
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Patient'}],
      }),
    );
    // navigation.reset;
    // navigation.navigate('Patient');
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
              title: 'emergencyContactInfo.emergencyContact',
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
