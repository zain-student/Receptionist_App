import React, {FC, useState, useEffect, useContext} from 'react';
import {
  ToastAndroid,
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Button, Screen, Text, EmptyState, Profile} from '../../components';
import {PatientStackScreenProps} from '../../navigators/PatientNavigator';
import {spacing, colors} from '../../theme';
import {useStores} from '../../models';
import {Service} from 'app/models/Service';
import {isRTL} from '../../i18n';
import moment from 'moment';
import {ageCalculator} from 'app/models/helpers/dateHelpers';
import {StackActions} from '@react-navigation/native';
import {compareAsc, format} from 'date-fns';
import {fetch} from '@react-native-community/netinfo';
import {UserContext} from 'app/utils/UserContext';
import {mmkvStorage} from 'app/models/AuthenticationStore';
var net = require('react-native-tcp');

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
  },
  {
    serviceId: 2,
    serviceName: 'Service2',
  },
  {
    serviceId: 3,
    serviceName: 'Service3',
  },
  {
    serviceId: 4,
    serviceName: 'Service4',
  },
  {
    serviceId: 5,
    serviceName: 'Service5',
  },
  {
    serviceId: 6,
    serviceName: 'Service6',
  },
  {
    serviceId: 7,
    serviceName: 'Service7',
  },
  {
    serviceId: 8,
    serviceName: 'Service8',
  },
  {
    serviceId: 9,
    serviceName: 'Service9',
  },
  {
    serviceId: 10,
    serviceName: 'Service10',
  },
  {
    serviceId: 11,
    serviceName: 'Service11',
  },
  {
    serviceId: 12,
    serviceName: 'Service12',
  },
];
let retryInterval: ReturnType<typeof setInterval>;
export const PatientServicesScreen: FC<
  PatientStackScreenProps<'PatientServices'>
> = function PatientServicesScreen(_props) {
  const {patientStore, serviceStore, authenticationStore} = useStores();
  const {
    totalAmount,
    selectedService,
    servicesForList,
    emptySelectedServices,
    resetTotalAmount,
  } = serviceStore;

  const [patient, setPatient] = useState('');
  const {navigation} = _props;
  const [service, setService] = useState('');
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [currentPatient, setCurrentPatient] = useState(
    patientStore.getSelectedPatient(),
  );
  const [refresh, setRefresh] = useState(false);
  const [socket, setSocket] = useState(null);

  const {
    patientQueue,
    addPatientInQueue,
    deselectPatient,
    selectedPatient,
    addSelectedPatientStatus,
    addServicesToSelectedPatient,
    addCheckedInSynced,
    getSelectedPatient,
    addCheckInTime,
  } = patientStore;

  const userContext = useContext(UserContext);

  const PatientItem = ({title}) => (
    <View>
      <Text testID="login-heading" preset="bold" style={$patientsText}>
        {title}
      </Text>
    </View>
  );

  useEffect(() => {
    (async function load() {
      setIsLoading(true);
      await serviceStore.fetchServices();
      setIsLoading(false);
    })();
  }, [serviceStore]);

  function patientItemPress(title: React.SetStateAction<string>) {
    console.log('-=-=-=-=-=-=-=-=-', title);
    console.log('-=-=-=-=-=-=-=-=-', patient);
    setPatient(title);
  }

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true);
    await Promise.all([serviceStore.fetchServices(), delay(750)]);
    setRefreshing(false);
  }
  function submitPress() {
    console.log('selected services........Number...', selectedService.length);
    if (selectedService.length > 0) {
      navigation.navigate('CashCollection');
    } else {
      ToastAndroid.show('No service selected yet !', ToastAndroid.SHORT);
    }
  }

  const ServiceItem = (item: any) => (
    <Button
      onPress={() => onServicePress(item.item)}
      testID={`service-selection-list-button`}
      // key={key}
      style={[
        $serviceButton,
        serviceStore.serviceSelected(item.item) && {
          backgroundColor: colors.themeColorLight,
        },
      ]}>
      <Text
        testID="login-heading"
        // tx={serviceName}
        preset="default"
        style={$pageTitle}>
        {item.item.ServiceName}
      </Text>
      {/* <Text numberOfLines={2} testID="login-heading" 
      // tx={serviceName}
        preset="bold" style={$pageTitle}>
        {item.item.Charges}
      </Text> */}
    </Button>
  );

  function onServicePress(item: any) {
    if (currentPatient.length > 0) {
      console.log('Service Pressed....', item);
      setRefresh(!refresh);
      serviceStore.toggleService(item);
    } else {
      ToastAndroid.show('Select Patient First', ToastAndroid.SHORT);
    }
  }

  function collectedPress() {
    const currentDateTime = moment().toISOString();
    console.log(
      'dated.......',
      currentDateTime,
      JSON.stringify(getSelectedPatient()[0]),
    );

    if (getSelectedPatient().length > 0) {
      if (selectedService.length > 0) {
        // var curPatient = currentPatient[0]
        // curPatient.Services = selectedService
        // curPatient.Status = 'CheckedIn'

        console.warn('first', getSelectedPatient()[0]);
        // if (global.socket) {
        console.warn('userContext.socket', userContext.socket);
        sendDataToNurseApp(currentDateTime);
        // } else {
        //   serverStore.createServer();
        // }
        addServicesToSelectedPatient(selectedService);
        addCheckedInSynced(false);
        addSelectedPatientStatus('CheckIn');
        addCheckInTime(currentDateTime);
        console.log('=-=-=-=-=', getSelectedPatient()[0]);

        addPatientInQueue(getSelectedPatient()[0]);

        deselectPatient(getSelectedPatient()[0]);
        emptySelectedServices();
        resetTotalAmount();
        ToastAndroid.show('Saved Successfully!', ToastAndroid.SHORT);
        navigation.dispatch(StackActions.replace('Home'));
      } else {
        ToastAndroid.show('No Service Selected Yet!', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('No patient Selected yet...!', ToastAndroid.SHORT);
      emptySelectedServices();
      navigation.dispatch(StackActions.replace('Home'));
    }
  }

  const sendDataToNurseApp = (_currentDateTime: string) => {
    try {
      let tempPatient = JSON.parse(JSON.stringify(getSelectedPatient()[0]));
      for (let i = 0; i < selectedService.length; i++) {
        if (tempPatient) {
          if (!tempPatient.Services.includes(selectedService[i])) {
            tempPatient.Services.push(selectedService[i]);
          }
        }
      }
      tempPatient.CheckInSynced = false;
      tempPatient.Status = 'CheckIn';
      tempPatient.CheckInTime = _currentDateTime;
      delete tempPatient.CellPhoneNumber;
      if (global.isServerConnected) {
        let savedData = mmkvStorage.getString('newPatients');
        if (savedData) {
          savedData = JSON.parse(savedData);
          let patientDetails =
            savedData?.find(item => item.PatientId === tempPatient.PatientId) ??
            {};

          tempPatient = {
            ...patientDetails,
            ...tempPatient,
            EnteredBy: {
              UserId: authenticationStore.login
                ? authenticationStore.login[0]?.UserId
                : '',
              FullName: authenticationStore.login
                ? authenticationStore.login[0]?.FullName
                : '',
            },
          };
        }
        console.warn('userContext.socket', savedData, tempPatient);
        global.socket.write(
          JSON.stringify({
            receiver: 'nurse',
            sender: 'receptionist',
            payload: tempPatient,
          }),
        );
      } else {
        // let retryCount = 0;
        // if (retryInterval) {
        //   clearInterval(retryInterval);
        // }
        // retryInterval = setInterval(() => {
        //   if (retryCount < 3) {
        //     if (global.isServerConnected) {
        //       global.socket.write(
        //         JSON.stringify({receiver: 'nurse', payload: tempPatient}),
        //       );
        //       clearInterval(retryInterval);
        //     }
        //   } else {
        //     clearInterval(retryInterval);
        //   }
        //   console.warn('retrying');
        //   retryCount++;
        // }, 3000);
        // ToastAndroid.show('Socket is null. Retrying', ToastAndroid.LONG);
      }
      console.warn('isConnected', global.isServerConnected);
    } catch (err) {
      console.warn('err', e);
      // ToastAndroid.show('Socket is null. Catch', ToastAndroid.LONG);
    }
  };

  const createServer = () => {
    const server = net
      .createServer(socket => {
        console.log('server connected on ' + socket.address().address);
        setSocket(socket);
        socket.on('data', data => {
          let response = JSON.parse(data);
          // setChats([...chats, {id: chats.length + 1, msg: response.msg}]);
          //   console.log('Server Received: ' + data);
          // socket.write('Echo server');
        });

        socket.on('error', error => {
          console.log('error ' + error);
        });

        socket.on('close', error => {
          console.log('server client closed ' + (error ? error : ''));
        });
      })
      .listen(6666, () => {
        console.log('opened server on ' + JSON.stringify(server.address()));
      });

    server.on('error', error => {
      console.log('error ' + error);
    });

    server.on('close', () => {
      console.log('server close');
    });

    return server;
  };

  const SelectedServiceItem = ({title}) => (
    <View style={$selectedServicesItem}>
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
  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$container}
      safeAreaEdges={['top']}>
      <Profile />
      {/* <Text preset="heading" tx="patientServicesScreen.services" style={$title} /> */}
      <FlatList<Service>
        data={servicesForList}
        refreshing={refreshing}
        extraData={refresh}
        // onRefresh={manualRefresh}
        numColumns={2}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyState
              preset="generic"
              style={$emptyState}
              headingTx={
                serviceStore.favoritesOnly
                  ? 'demoPodcastListNoScreen.noFavoritesEmptyState.heading'
                  : undefined
              }
              contentTx={
                serviceStore.favoritesOnly
                  ? 'demoPodcastListScreen.noFavoritesEmptyState.content'
                  : undefined
              }
              button={serviceStore.favoritesOnly ? null : undefined}
              buttonOnPress={manualRefresh}
              imageStyle={$emptyStateImage}
              ImageProps={{resizeMode: 'contain'}}
            />
          )
        }
        style={$serviceListView}
        renderItem={({item}) => <ServiceItem item={item} />}
        keyExtractor={item => item.ServiceId}
      />
      {/* <FlatList
            data={SITES}
            numColumns={2}
            style={$serviceListView}
            renderItem={({item}) => <ServiceItem title={item.serviceName} />}
            keyExtractor={item => item.serviceId}
          /> */}
      <View style={[$buttonsView, {flex: 0.5}]}>
        <FlatList
          data={selectedService}
          // numColumns={2}
          style={$serviceListView}
          renderItem={({item}) => <SelectedServiceItem title={item} />}
          keyExtractor={item => item.ServiceId}
        />
      </View>
      <View
        style={[$selectedServicesItem, {backgroundColor: colors.themeText}]}>
        <Text
          testID="login-heading"
          // tx={serviceName}
          preset="bold"
          style={$pageTitle}>
          {'Total: '}
        </Text>
        <Text
          testID="login-heading"
          // tx={serviceName}
          preset="bold"
          style={$pageTitle}>
          {totalAmount}
        </Text>
      </View>
      <View style={$buttonsView}>
        <Button
          testID="login-button"
          tx={'patientServicesScreen.collectCash'}
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
  flex: 4,
  borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  marginVertical: spacing.sm,
};

const $patientsText: TextStyle = {
  padding: spacing.sm,
};

const $buttonsView: ViewStyle = {
  flex: 0.25,
  flexDirection: 'row',
  width: '100%',
  marginBottom: 60,
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
  backgroundColor: colors.themeText,
};

const $serviceButton: ViewStyle = {
  flex: 1,
  minHeight: 100,
  borderWidth: 0.5,
  borderRadius: 5,
  margin: spacing.xs,
  elevation: 8,
  backgroundColor: colors.background,
  flexDirection: 'column',
};

const $serviceListView: ViewStyle = {
  flex: 2,
  // margin: spacing.md
};

const $pageTitle: TextStyle = {
  textAlign: 'center',
  alignSelf: 'center',
  fontSize: 14,
};

const $patientProfileView: ViewStyle = {
  backgroundColor: 'green',
  padding: spacing.sm,
};

const $patientProfileText: TextStyle = {
  color: 'white',
};

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
};

const $emptyStateImage: ImageStyle = {
  transform: [{scaleX: isRTL ? -1 : 1}],
};

const $selectedServicesItem: ViewStyle = {
  flexDirection: 'row',
  width: '95%',
  backgroundColor: colors.themeYellow,
  // height: 30,
  margin: spacing.xs,
  justifyContent: 'space-between',
  paddingHorizontal: spacing.md,
  borderRadius: 5,
};

// @home remove-file
