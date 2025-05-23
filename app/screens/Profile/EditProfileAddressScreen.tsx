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
import {ProfileIconButton} from '../HomeScreen/ProfileIconButton';
import {HeaderBackButton} from '../HomeScreen/HeaderBackButton';
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

export const EditProfileAddressScreen: FC<
  EditProfileStackScreenProps<'EditProfileAddressScreen'>
> = function EditProfileAddressScreen(_props) {
  const {navigation} = _props;
  const route = useRoute();
  const patientIndex = route.params?.patientIndex ?? 0;
  const patientData = route.params?.patientData ?? {};

  // const {patientIndex, patientData} = route.params;
  const {pickerStore, patientStore, newPatientStore} = useStores();
  const {getCountriesForList, getProvincesForList, getCitiesForList} =
    pickerStore;

  const {addNewPatient, latestIndex, newPatientsForList} = newPatientStore;

  // const [address, setAddress] = useState('');
  const [address, setAddress] = useState(patientData?.Address || '');

  const [countryItems, setCountryItems] = useState(getCountriesForList);
  const [countryDropdownOpen, setcountryDropdownOpen] = useState(false);
  const [country, setCountry] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState();

  const [provinceItems, setProvinceItems] = useState(getProvincesForList);
  const [provinceDropdownOpen, setProvinceDropdownOpen] = useState(false);
  const [province, setProvince] = useState([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState();

  const [cityItems, setCityItems] = useState(getCitiesForList);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [city, setCity] = useState([]);
  useEffect(() => {
    if (patientData) {
      setAddress(patientData.Address || '');
      setCountry(patientData.CountryId);
      setProvince(patientData.ProvinceId);
      setCity(patientData.CityId);
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
  //   console.log('-=-=-=-=-=-', latestIndex());
  //   console.log('-=-=-=-=-=--=-=-=-=', newPatientsForList);
  //   const index = latestIndex() > 0 ? latestIndex() - 1 : 0;
  //   const patientIndex =
  //     patientStore.latestIndex() > 0 ? patientStore.latestIndex() - 1 : 0;

  //   console.warn('province', province, city);
  //   if (
  //     Array.isArray(country) ||
  //     Array.isArray(province) ||
  //     Array.isArray(city)
  //   ) {
  //     ToastAndroid.show('Please fill all required fields', ToastAndroid.LONG);
  //     return;
  //   }

  //   let _country = country + '';
  //   //
  //   let _province = province + '';
  //   //
  //   let _city = city + '';

  //   // newPatientStore.addAddressToNewPatient(
  //   //   address,
  //   //   _country,
  //   //   _province,
  //   //   _city,
  //   //   index,
  //   // );
  //   // patientStore.addAddressToNewPatient(
  //   //   address,
  //   //   _country,
  //   //   _province,
  //   //   _city,
  //   //   patientIndex,
  //   // );
  //   newPatientStore.addAddressToNewPatientAndUpdateMainStore(
  //     _address,
  //     _country,
  //     _province,
  //     _city,
  //     index,
  //     patientId,
  //     patientStore,
  //   );
  function save() {
    // const patientIndex = /* get current patient index properly here */;

    // if (
    //   Array.isArray(country) ||
    //   Array.isArray(province) ||
    //   Array.isArray(city)
    // )
    if (!country || !province || !city) {
      // !address ||
      ToastAndroid.show('Please fill all required fields', ToastAndroid.LONG);
      return;
    }

    // {
    //   ToastAndroid.show('Please fill all required fields', ToastAndroid.LONG);
    //   return;
    // }

    newPatientStore.updateNewPatient(patientIndex, {
      Address: String(address),
      Country: String(country),
      Province: String(province),
      City: String(city),
    });

    // console.log('Updated Address Info:', {
    //   Address: address,
    //   Country: country,
    //   Province: province,
    //   City: city,
    // });
    console.log('Updated Patient Data:', newPatientsForList[patientIndex]);
    console.log('Updated Patient Basic Info :', patientData);
    ToastAndroid.show('Address Info Updated', ToastAndroid.SHORT);
    navigation.navigate('EditProfileContactScreen', {
      patientIndex: patientIndex,
      patientData: {
        ...patientData,
        Address: address,
        Country: country,
        Province: province,
        City: city,
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
              title: 'EditAddressInfoScreen.addressInfo',
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
          tx="EditAddressInfoScreen.addressInfo"
          style={$title}
        />
        <View style={$fieldsView}>
          <View style={$fieldRowView}>
            <TextField
              value={address}
              onChangeText={setAddress}
              inputWrapperStyle={{backgroundColor: colors.inputBackground}}
              containerStyle={$textField}
              autoCapitalize="none"
              // autoComplete="email"
              autoCorrect={false}
              keyboardType="default"
              labelTx="addressInfoScreen.address"
              placeholderTx="addressInfoScreen.address"
              // onSubmitEditing={() => authPasswordInput.current?.focus()}
            />
          </View>

          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'CountryName',
                  value: 'Id',
                }}
                placeholder="Countries"
                open={countryDropdownOpen}
                value={country}
                items={countryItems}
                setOpen={setcountryDropdownOpen}
                setValue={setCountry}
                listMode="MODAL"
                onChangeValue={(value: any) => {
                  console.log('value...', value);
                  setSelectedCountryId(value);
                }}
                // setItems={setItems}

                // theme="DARK"
                // multiple={true}
                // mode="BADGE"
                // badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
              />
            </View>
          </View>
          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'ProvinceName',
                  value: 'Id',
                }}
                placeholder="Province"
                open={provinceDropdownOpen}
                value={province}
                // items={provinceItems}
                items={provinceItems.filter(function (item) {
                  // console.log('country id', item.CountryId);
                  return item.CountryId === selectedCountryId;
                })}
                setOpen={setProvinceDropdownOpen}
                setValue={setProvince}
                listMode="MODAL"
                onChangeValue={(value: any) => {
                  setSelectedProvinceId(value);
                }}
                // setItems={setItems}

                // theme="DARK"
                // multiple={true}
                // mode="BADGE"
                // badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
              />
            </View>
          </View>

          <View style={$fieldRowView}>
            <View style={$dropdownView}>
              <DropDownPicker
                schema={{
                  label: 'CityName',
                  value: 'Id',
                }}
                placeholder="City"
                open={cityDropdownOpen}
                value={city}
                items={cityItems.filter(function (item) {
                  return item.ProvinceId === selectedProvinceId;
                })}
                setOpen={setCityDropdownOpen}
                setValue={setCity}
                listMode="MODAL"
                // setItems={setItems}
                // theme="DARK"
                // multiple={true}
                // mode="BADGE"
                // badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
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
