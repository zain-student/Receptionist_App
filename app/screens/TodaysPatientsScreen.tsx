
import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
} from 'react-native';
import {TextInput, Button, ListItem, Screen, Text, Header} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {spacing, colors} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {useStores} from 'app/models';
import {calculateFullAge} from 'app/models/helpers/dateHelpers';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import {useFocusEffect} from '@react-navigation/native';
import {UserContext} from 'app/utils/UserContext';
import {api} from 'app/services/api';
import {useRoute} from '@react-navigation/native';
import {NewPatientStore} from 'app/models/NewPatientStore';
import {PatientStore} from 'app/models/PatientStore';
import {observer} from 'mobx-react-lite';
import {parse} from 'date-fns';
let restrictBackPress = false;
export const TodaysPatientsScreen: FC<HomeTabScreenProps<'TodaysPatients'>> =
  observer(function TodaysPatientsScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation} = _props;
    const {patientStore, newPatientStore} = useStores();
    const {patientQueue, patientQueueForList} = patientStore;

    const [query, setQuery] = useState('');
    const [refresh, setRefresh] = useState('1');
    const userContext = useContext(UserContext);
    const route = useRoute();
    const patientData = route.params?.patientData;
    const patientIndex = route.params?.patientIndex;
    // useFocusEffect(
    //   useCallback(() => {
    //     setRefresh(Math.random().toString());
    //   }, [userContext.refreshData]),
    // );
    useFocusEffect(
      useCallback(() => {
        // if (
        //   route.params?.patientData &&
        //   route.params?.patientIndex !== undefined
        // ) {
        //   // Update the patient in the MobX store
        //   patientStore.updateNewPatient(
        //     route.params.patientIndex,
        //     route.params.patientData,
        //   );

        // Optional: clear the params to avoid reapplying them
        //   navigation.setParams({
        //     patientData: undefined,
        //     patientIndex: undefined,
        //   });
        // }

        setRefresh(Math.random().toString());
      }, [
        route.params?.patientData,
        route.params?.patientIndex,
        userContext.refreshData,
      ]),
    );
    // useEffect(() => {
    // if (patientData && patientIndex !== undefined) {
    // // Update the patient in the MobX store
    // patientStore.updateNewPatient;
    // // Optional: clear the params to avoid reapplying them
    // navigation.setParams({
    //   patientData: undefined,
    //   patientIndex: undefined,
    // });
    // console.log('Patient Data:', patientData);

    //     console.log(
    //       'Updated Patient Data in Today patient screen:',
    //       patientData,
    //     );
    //     console.log('Patient Index:', patientIndex);
    //   }
    // });
    useFocusEffect(
      useCallback(() => {
        restrictBackPress = false;
        if (
          route.params?.patientData &&
          route.params?.patientIndex !== undefined
        ) {
          newPatientStore.updateNewPatient(
            route.params.patientIndex,
            route.params.patientData,
          );
          patientStore.updatePatient(route.params.patientData); //.................
          navigation.setParams({
            patientData: undefined,
            patientIndex: undefined,
          });
        }

        setRefresh(Math.random().toString());
      }, [
        route.params?.patientData,
        route.params?.patientIndex,
        userContext.refreshData,
      ]),
    );

    // useFocusEffect(
    //   useCallback(() => {
    //     restrictBackPress = false;
    //   }, []),
    // );
    // const formatDate = dob => {
    //   if (!dob) return 'N/A';

    //   const date = new Date(dob);
    //   if (isNaN(date)) return 'Invalid Date';

    //   const day = String(date.getDate()).padStart(2, '0');
    //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    //   const year = date.getFullYear();

    //   return `${day}-${month}-${year}`;
    // };
    // Utility: Safely parse various DOB formats
const parseDOB = (dob) => {
  if (!dob) return null;

  if (dob instanceof Date && !isNaN(dob)) {
    return dob; // Already a valid Date object
  }

  // Try parsing known formats
  const tryFormats = [
    "dd/MM/yyyy hh:mm:ss a", // App saved format
    "d/M/yyyy hh:mm:ss a",   // Loose format (e.g., 8/1/2015)
    "MM/dd/yyyy",            // US-style fallback
    "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", // ISO format
  ];

  for (let formatStr of tryFormats) {
    try {
      const parsed = parse(dob, formatStr, new Date());
      if (!isNaN(parsed)) return parsed;
    } catch (e) {}
  }

  const fallback = new Date(dob);
  return isNaN(fallback) ? null : fallback;
};

// Utility: Display date in UI
const formatDate = (dob) => {
  console.log("DOB:::", dob)
  const date = parseDOB(dob);
  if (!date) return "N/A";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


    const PatientItem = ({title, total, index}) => (
      <View style={$patientItemView}>
        <View style={$patientItemTitleView}>
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {'T/No: ' + (index + 1)}
          </Text>
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {'MRN: ' + title.MRNNo}
          </Text>
        </View>
        <View style={$patientItemDetailView}>
          <Text testID="login-heading" preset="bold" style={$patientsText}>
            {title.FirstName + ' ' + title.LastName}
          </Text>
          <Text testID="login-heading" preset="default" style={$patientsText}>
            {title.Gender + ' | ' + calculateFullAge(title.DOB)}
          </Text>
        </View>
        <View style={$patientItemDetailView}>
          <Text testID="login-heading" preset="bold" style={$patientsText}>
            {'Address: '}
          </Text>
          <Text testID="login-heading" preset="default" style={$patientsText}>
            {title.Address}
          </Text>
        </View>
        <View style={$patientItemDetailView}>
          <Text testID="login-heading" preset="bold" style={$patientsText}>
            {'DOB: '}
          </Text>
          <Text testID="login-heading" preset="default" style={$patientsText}>
            {formatDate(title.DOB)}
          </Text>
        </View>

        {title.Services.length > 0 ? (
          <View style={[$patientItemDetailView, {flexDirection: 'column'}]}>
            {title.Services.map(item => {
              total = total + parseInt(item.Charges);
              return (
                <View style={$serviceItem}>
                  <Text testID="login-heading" style={$patientsText}>
                    {item.ServiceName}
                  </Text>
                  <Text testID="login-heading" style={$patientsText}>
                    {item.Charges}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}
        {total > 0 ? (
          <View style={[$patientItemDetailView, {flexDirection: 'column'}]}>
            <View style={[$serviceItem, {backgroundColor: '#F4F4F4'}]}>
              <Text testID="login-heading" style={$patientsText}>
                {'Total: '}
              </Text>
              <Text testID="login-heading" style={$patientsText}>
                {total}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    );

    function patientItemPress(title: React.SetStateAction<string>) {
      console.log('-=-=-=-=-=-=-=-=-OOO', title);
      console.log('-=-=-=-=-=-=-=-=-AAA', patient);
      setPatient(title);
    }

    function addNewPress() {
      navigation.navigate('Profile');
    }

    function advanceSearchPress() {
      navigation.navigate('Patient');
    }

    const profilePress = () => {
      // console.log('Profile pressed.......')
    };
    const {selectedPatient} = patientStore;

    return (
      <>
        <Header
          LeftActionComponent={
            <HeaderBackButton
              {...{
                title: 'todaysPatientsScreen.todaysPatients',
                navigation: navigation,
                restrictBackPress: restrictBackPress,
              }}
            />
          }
          RightActionComponent={<ProfileIconButton onPress={profilePress} />}
        />
        <Screen preset="fixed" contentContainerStyle={$container}>
          <View style={$patientsListView}>
            <FlatList
              key={refresh}
              data={patientQueueForList()}
              extraData={patientQueueForList()}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    console.log('Patient Index:', index);
                    navigation.navigate('Profile', {
                      screen: 'EditProfileBasicInfoScreen',
                      params: {
                        patientData: item,
                        patientIndex: index,
                      },
                    });
                  }}>
                  <PatientItem title={item} total={0} index={index} />
                </TouchableOpacity>
              )}
            />
          </View>
        </Screen>
      </>
    );
  });

const $container: ViewStyle = {
  paddingHorizontal: spacing.lg,
  flex: 1,
};

const $title: TextStyle = {
  flex: 0.5,
  marginBottom: spacing.sm,
};

const $patientsListView: ViewStyle = {
  flex: 1,
  width: '100%',
  alignSelf: 'center',
  marginVertical: spacing.sm,
};

const $patientsText: TextStyle = {};

const $buttonsView: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  width: '100%',
};

const $patientItemDetailView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  borderWidth: 0.25,
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: spacing.sm,
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $patientItemView: ViewStyle = {
  elevation: 8,
  marginVertical: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 10,
};

const $patientItemTitleView: ViewStyle = {
  flex: 1,
  backgroundColor: colors.themeColorLight,
  borderTopRightRadius: 6,
  borderTopLeftRadius: 6,
  padding: spacing.sm,
  borderWidth: 0.25,
  elevation: 0,
  flexDirection: 'row',
  justifyContent: 'space-around',
};

const $patientTitleText: TextStyle = {
  fontSize: 14,
  color: colors.themeText,
};

const $serviceItem: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: colors.palette.accent200,
  margin: '2%',
  paddingHorizontal: '4%',
  borderRadius: 5,
};

const $patientSearch: ViewStyle = {
  paddingHorizontal: 20,
  borderWidth: 0.5,
  borderRadius: 5,
};
