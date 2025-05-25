import React, {FC, useState, useEffect} from 'react';
import {
  ToastAndroid,
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
} from 'react-native';
import {Button, Screen, Text, Profile} from '../../components';
import {PatientStackScreenProps} from '../../navigators/PatientNavigator';
import {spacing, colors} from '../../theme';
import {useStores} from '../../models';
import {StackActions} from '@react-navigation/native';

const PATIENT = {
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
};

const SITES = [
  {
    serviceId: 1,
    serviceName: 'Service1',
    price: 100,
  },
  {
    serviceId: 2,
    serviceName: 'Service2',
    price: 50,
  },
  {
    serviceId: 3,
    serviceName: 'Service3',
    price: 50,
  },
];

export const CashCollectionScreen: FC<
  PatientStackScreenProps<'CashCollection'>
> = function CashCollectionScreen(_props) {
  const [patient, setPatient] = useState('');
  const {navigation} = _props;
  const [service, setService] = useState('');
  const {patientStore, serviceStore} = useStores();
  const {selectedService, emptySelectedServices} = serviceStore;
  const {
    patientQueue,
    addPatientInQueue,
    deselectPatient,
    selectedPatient,
    addSelectedPatientStatus,
    addServicesToSelectedPatient,
    addCheckedInSynced,
    getSelectedPatient,
  } = patientStore;
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPatient, setCurrentPatient] = React.useState(
    getSelectedPatient(),
  );

  useEffect(() => {
    var total = 0;
    for (var i = 0; i < selectedService.length; i++) {
      total = total + parseInt(selectedService[i].Charges);
    }
    setTotalAmount(total);
  }, [selectedService]);

  function collectedPress() {
    if (getSelectedPatient().length > 0) {
      // var curPatient = currentPatient[0]
      // curPatient.Services = selectedService
      // curPatient.Status = 'CheckedIn'
      addServicesToSelectedPatient(selectedService);
      addCheckedInSynced(false);
      addSelectedPatientStatus('CheckIn');
      console.log('=-=-=-=-=HH', getSelectedPatient()[0]);

      addPatientInQueue(getSelectedPatient()[0]);

      deselectPatient(getSelectedPatient()[0]);
      emptySelectedServices();
      ToastAndroid.show('Saved Successfully!', ToastAndroid.SHORT);
      navigation.dispatch(StackActions.replace('Home'));
    } else {
      ToastAndroid.show('No patient Selected yet...!', ToastAndroid.SHORT);
      emptySelectedServices();
      navigation.dispatch(StackActions.replace('Home'));
    }
  }

  const ServiceItem = ({title}) => (
    <View style={{flexDirection: 'row'}}>
      <Text
        testID="login-heading"
        // tx={serviceName}
        preset="bold"
        style={$pageTitle}>
        {title.ServiceName + ':     '}
      </Text>
      <Text
        testID="login-heading"
        // tx={serviceName}
        preset="bold"
        style={$pageTitle}>
        {title.Charges}
      </Text>
    </View>
  );

  function onServicePress(title) {
    console.log('=-=-=-=-=', title);
    setService(title);
  }
  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$container}
      safeAreaEdges={['top']}>
      <Profile />
      <Text
        preset="heading"
        tx="cashCollectionScreen.cashCollection"
        style={$title}
      />
      <View style={$patientsListView}>
        <FlatList
          data={selectedService}
          numColumns={2}
          style={$serviceListView}
          renderItem={({item}) => <ServiceItem title={item} />}
          keyExtractor={item => item.ServiceId}
        />
      </View>
      <View style={$totalAmountView}>
        <Text
          testID="login-heading"
          // tx={serviceName}
          preset="bold"
          style={$pageTitle}>
          {'Total Amount: '}
        </Text>
        <Text
          testID="login-heading"
          // tx={serviceName}
          preset="bold"
          style={$totalAmountText}>
          {totalAmount}
        </Text>
      </View>
      <View style={$buttonsView}>
        <Button
          testID="login-button"
          tx={'cashCollectionScreen.collected'}
          style={$tapButton}
          preset="reversed"
          onPress={collectedPress}
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
  // flex: 0.5,
  textAlign: 'center',
  marginTop: spacing.xxxs,
};

const $patientsListView: ViewStyle = {
  flex: 3,
  borderWidth: 1,
  width: '70%',
  alignSelf: 'center',
  marginVertical: spacing.sm,
};

const $patientsText: TextStyle = {
  padding: spacing.sm,
};

const $buttonsView: ViewStyle = {
  flex: 0.5,
  flexDirection: 'row',
  width: '100%',
  marginBottom: 60,
};

const $totalAmountView: ViewStyle = {
  flex: 0.5,
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'center',
  // marginBottom: 40
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $serviceButton: ViewStyle = {
  flex: 1,
  borderWidth: 0.5,
  borderRadius: 5,
  margin: spacing.sm,
  elevation: 8,
  backgroundColor: colors.background,
};

const $serviceListView: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $pageTitle: TextStyle = {
  padding: spacing.sm,
  // textAlign: 'center',
  alignSelf: 'center',
  width: '80%',
};

const $totalAmountText: TextStyle = {
  padding: spacing.sm,
  textAlign: 'center',
  alignSelf: 'center',
  borderWidth: 1,
};

const $patientProfileView: ViewStyle = {
  backgroundColor: 'green',
  padding: spacing.sm,
};

const $patientProfileText: TextStyle = {
  // padding: spacing.sm,
  // textAlign: 'center',
  // alignSelf: 'center',
  color: 'white',
};
// @home remove-file
