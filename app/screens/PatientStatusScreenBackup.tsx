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
import {Button, ListItem, Screen, Text} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {spacing, colors} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {Icon} from '../components';
import {useStores} from 'app/models';
import {ageCalculator} from 'app/models/helpers/dateHelpers';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const chainReactLogo = require('../../assets/images/cr-logo.png');
const reactNativeLiveLogo = require('../../assets/images/rnl-logo.png');
const reactNativeRadioLogo = require('../../assets/images/rnr-logo.png');
const reactNativeNewsletterLogo = require('../../assets/images/rnn-logo.png');

const STATUS = ['Checkin', 'Vitals', 'Prescription', 'Pharmacy', 'Checkout'];
const PATIENTS = [
  {
    patientId: 1,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: true,
    pharmacySynced: true,
    checkoutSynced: true,
  },
  {
    patientId: 2,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: true,
    pharmacySynced: true,
    checkoutSynced: false,
  },
  {
    patientId: 3,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: true,
    checkoutSynced: true,
  },
  {
    patientId: 4,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 5,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
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
  },
  {
    patientId: 7,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 8,
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
  },
  {
    patientId: 9,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 10,
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
  },
];

export const PatientStatusScreen: FC<HomeTabScreenProps<'PatientStatus'>> =
  function PatientStatusScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation} = _props;
    const {patientStore} = useStores();
    const {patientQueue} = patientStore;

    const PatientItem = ({title}) => (
      <View style={$patientItemView}>
        <View style={$patientItemTitleView}>
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {title.MRNNo}
          </Text>
        </View>
        <View style={[$patientItemInnerView, {flexDirection: 'row'}]}>
          <View style={$patientItemInnerView}>
            <Text
              testID="login-heading"
              preset="bold"
              style={[$patientsText, {color: colors.palette.primary600}]}>
              {title.FirstName + ' ' + title.LastName}
            </Text>
            <Text testID="login-heading" preset="bold" style={$patientsText}>
              {title.Gender + ' | ' + ageCalculator(title.DOB)}
            </Text>
          </View>
          <View style={$patientItemIconsView}>
            <View
              style={[
                $statusIconView,
                title.Status == 'CheckIn' && {
                  borderWidth: 2,
                  borderColor: 'green',
                },
              ]}>
              <Icon icon="checkin" size={30} />
              <Icon
                icon="sync"
                color={title.CheckInSynced && 'green'}
                size={20}
              />
            </View>
            <View
              style={[
                $statusIconView,
                title.Status == 'Vitals' && {
                  borderWidth: 2,
                  borderColor: 'green',
                },
              ]}>
              <Icon icon="vitals" size={30} />
              <Icon
                icon="sync"
                color={title.vitalsSynced && 'green'}
                size={20}
              />
            </View>
            <View
              style={[
                $statusIconView,
                title.Status == 'Prescription' && {
                  borderWidth: 2,
                  borderColor: 'green',
                },
              ]}>
              <Icon icon="prescription" size={30} />
              <Icon
                icon="sync"
                color={title.prescriptionSynced && 'green'}
                size={20}
              />
            </View>
            <View
              style={[
                $statusIconView,
                title.Status == 'Pharmacy' && {
                  borderWidth: 2,
                  borderColor: 'green',
                },
              ]}>
              <Icon icon="pharmacy" size={30} />
              <Icon icon="sync" size={20} />
            </View>
            <View
              style={[
                $statusIconView,
                title.Status == 'Checkout' && {
                  borderWidth: 2,
                  borderColor: 'green',
                },
              ]}>
              <Icon icon="checkout" size={30} />
              <Icon
                icon="sync"
                color={title.heckoutSynced && 'green'}
                size={20}
              />
            </View>
          </View>
        </View>
      </View>
    );

    function patientItemPress(title: React.SetStateAction<string>) {
      console.log('-=-=-=-=-=-=-=-=-', title);
      console.log('-=-=-=-=-=-=-=-=-', patient);
      setPatient(title);
    }

    function addNewPress() {
      navigation.navigate('Profile');
    }

    function advanceSearchPress() {
      navigation.navigate('Patient');
    }

    return (
      <Screen
        preset="fixed"
        contentContainerStyle={$container}
        safeAreaEdges={['top']}>
        <Text
          preset="heading"
          tx="patientStatusScreen.patientStatus"
          style={$title}
        />
        <View style={$patientsListView}>
          <FlatList
            data={patientQueue}
            // style={$patientsListView}
            extraData={patientQueue}
            renderItem={({item}) => <PatientItem title={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Screen>
    );
  };

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
};

const $title: TextStyle = {
  flex: 0.5,
  marginBottom: spacing.sm,
};

const $patientsListView: ViewStyle = {
  flex: 6,
  borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  marginVertical: spacing.sm,
  borderRadius: 10,
  elevation: 5,
  backgroundColor: colors.background,
};

const $patientsText: TextStyle = {
  // padding: spacing.sm,
};

const $buttonsView: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  // alignSelf: 'baseline',
  // position: 'absolute',
  // bottom: 20,
  width: '100%',
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $patientItemView: ViewStyle = {
  flex: 2,
  elevation: 10,
  borderWidth: 1,
  margin: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 20,
  padding: '4%',
  paddingVertical: '6%',
  borderColor: colors.palette.accent500,
};

const $patientItemTitleView: ViewStyle = {
  // borderWidth: 0.5,
  position: 'absolute',
  backgroundColor: colors.palette.accent500,
  top: -spacing.sm,
  start: spacing.sm,
  borderRadius: 25,
  paddingHorizontal: spacing.sm,
  alignItems: 'center',
  justifyContent: 'center',
};

const $patientTitleText: TextStyle = {
  paddingHorizontal: spacing.sm,
};

const $patientItemInnerView: ViewStyle = {
  flex: 1.1,
};

const $patientItemIconsView: ViewStyle = {
  flex: 1.5,
  flexDirection: 'row',
  alignItems: 'center',
};

const $statusIconView: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: spacing.xxxs,
  paddingVertical: spacing.xxs,
};
// @home remove-file
