/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams, // @demo remove-current-line
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';
import * as Screens from 'app/screens';
import Config from '../config';
import {useStores} from '../models'; // @demo remove-current-line
import {DemoNavigator, DemoTabParamList} from './DemoNavigator'; // @demo remove-current-line
import {HomeNavigator, HomeTabParamList} from './HomeNavigator';
import {navigationRef, useBackButtonHandler} from './navigationUtilities';
import {colors} from 'app/theme';
import {PatientNavigator, PatientStackParamList} from './PatientNavigator';
import {ProfileNavigator, ProfileStackParamList} from './ProfileNavigator';
import {UserContext} from 'app/utils/UserContext';
import {fetch} from '@react-native-community/netinfo';
import KeepAwake from 'react-native-keep-awake';
import {mmkvStorage} from 'app/models/AuthenticationStore';
import {api} from 'app/services/api';

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Landing: undefined;
  SitesScreen: undefined;
  Home: NavigatorScreenParams<HomeTabParamList>;
  Demo: NavigatorScreenParams<DemoTabParamList>; // @demo remove-current-line
  Patient: NavigatorScreenParams<PatientStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;

  // 🔥 Your screens go here
  // Landing: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
};

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();
var net = require('react-native-tcp');
// let _socket;

const AppStack = observer(function AppStack() {
  // @demo remove-block-start
  const {
    authenticationStore: {isAuthenticated},
    serviceStore,
  } = useStores();
  const {patientStore} = useStores();

  const [socket, setSocket] = useState(null);
  const [doctorSocket, setDoctorSocket] = useState(null);
  const [pharmacySocket, setPharmacySocket] = useState(null);
  const [refreshData, setRefreshData] = useState('1');

  const updateSocket = (sock: any) => {
    setSocket(sock);
  };

  const updateDoctorSocket = (sock: any) => {
    setDoctorSocket(sock);
  };

  const updatePharmacySocket = (sock: any) => {
    setPharmacySocket(sock);
  };

  useEffect(() => {
    try {
      KeepAwake.activate();
      global.successResponses = [];
      if (mmkvStorage.getString('successResponses')) {
        global.successResponses = JSON.parse(
          mmkvStorage.getString('successResponses'),
        );
      }
      //Doctor
      global.docSuccessResponses = [];
      if (mmkvStorage.getString('docSuccessResponses')) {
        global.docSuccessResponses = JSON.parse(
          mmkvStorage.getString('docSuccessResponses'),
        );
      }
      //Pharmacy
      global.pharmSuccessResponses = [];
      if (mmkvStorage.getString('pharmSuccessResponses')) {
        global.pharmSuccessResponses = JSON.parse(
          mmkvStorage.getString('pharmSuccessResponses'),
        );
      }
      //PharmacyStatus in Doc
      global.pharmSuccessinDoc = [];
      if (mmkvStorage.getString('pharmSuccessinDoc')) {
        global.pharmSuccessinDoc = JSON.parse(
          mmkvStorage.getString('pharmSuccessinDoc'),
        );
      }
      if (mmkvStorage.getString('authToken')) {
        api.apisauce.setHeader(
          'Authorization',
          `Bearer ${mmkvStorage.getString('authToken')}`,
        );
      }

      if (global.socket) {
        // userContext.closeServer();
      } else {
        global.isServerConnected = false;
        createServer();
      }
    } catch (e) {}
  }, []);

  const createServer = () => {
    try {
      fetch().then(state => {
        console.log('Connection type', state.type);
        console.log(
          'Is connected?',
          state.isConnected,
          state.details?.ipAddress,
        );
        let temp_ip = state.details?.ipAddress;
        // if (temp_ip) setIp(temp_ip);
      });

      global.server = net
        .createServer(socket => {
          console.log(
            'server connected on ' + socket._id,
            JSON.stringify(socket),
          );
          socket.on('data', data => {
            try {
              let response = JSON.parse(data);
              console.warn('data rrec', response);
              if (response.type === 'initial') {
                if (response.from === 'doctor') {
                  global.doctorSocket = socket;
                  global.doctorSocketId = socket._id;
                  global.isDoctorServerConnected = true;
                  updateDoctorSocket(socket);
                } else if (response.from === 'pharmacy') {
                  global.pharmacySocket = socket;
                  global.pharmacySocketId = socket._id;
                  global.isPharmacyServerConnected = true;
                  updatePharmacySocket(socket);
                } else {
                  global.socket = socket;
                  global.isServerConnected = true;
                  updateSocket(socket);
                }
                return;
              }
              /////////////Receive Success Responses ////////////////////
              if (response.type === 'resp_success') {
                if (response.from === 'doctor') {
                  if (response.successType === 'pharmacy') {
                    global.pharmSuccessinDoc.push(response.patientId);
                    mmkvStorage.set(
                      'pharmSuccessinDoc',
                      JSON.stringify(global.pharmSuccessinDoc),
                    );
                  } else {
                    global.docSuccessResponses.push(response.patientId);
                    mmkvStorage.set(
                      'docSuccessResponses',
                      JSON.stringify(global.docSuccessResponses),
                    );
                  }
                  setRefreshData(Math.random().toString());
                } else if (response.from === 'pharmacy') {
                  global.pharmSuccessResponses.push(response.patientId);
                  mmkvStorage.set(
                    'pharmSuccessResponses',
                    JSON.stringify(global.pharmSuccessResponses),
                  );
                  setRefreshData(Math.random().toString());
                } else if (response.from === 'nurse') {
                  global.successResponses.push(response.patientId);
                  mmkvStorage.set(
                    'successResponses',
                    JSON.stringify(global.successResponses),
                  );
                  setRefreshData(Math.random().toString());
                }
                return;
              }
              /////////////Receive Success Responses ////////////////////
              console.warn('response', response);
              /////////////Send Back Success Responses ////////////////////
              if (response.sender === 'nurse') {
                try {
                  global.socket.write(
                    JSON.stringify({
                      type: 'resp_success',
                      from: 'receptionist',
                      receiver: 'nurse',
                      patientId: response.payload.PatientId,
                    }),
                  );
                } catch (e) {}
              }
              if (response.sender === 'doctor') {
                try {
                  global.doctorSocket.write(
                    JSON.stringify({
                      type: 'resp_success',
                      from: 'receptionist',
                      receiver: 'doctor',
                      patientId: response.payload.PatientId,
                      isCheckoutSync: response.isCheckoutSync
                    }),
                  );
                } catch (e) {}
              }
              if (response.sender === 'pharmacy') {
                try {
                  global.pharmacySocket.write(
                    JSON.stringify({
                      type: 'resp_success',
                      from: 'receptionist',
                      receiver: 'pharmacy',
                      patientId: response.payload.PatientId,
                    }),
                  );
                } catch (e) {}
              }
              /////////////Send Back Success Responses ////////////////////
              if (
                response.sender === 'nurse' &&
                global.isDoctorServerConnected
              ) {
                if (global.docSuccessResponses) {
                  let sIndexToFind = global.docSuccessResponses.findIndex(
                    itm => itm === response.payload?.PatientId,
                  );
                  if (sIndexToFind !== -1) {
                    global.docSuccessResponses.splice(sIndexToFind, 1);
                  }
                }
                global.doctorSocket.write(
                  JSON.stringify({
                    receiver: 'doctor',
                    sender: 'nurse',
                    payload: response.payload,
                  }),
                );
              }
              if (response.sender === 'doctor' && global.isServerConnected) {
                let peyload = JSON.parse(JSON.stringify(response.payload));
                delete peyload.Medications;
                global.socket.write(
                  JSON.stringify({
                    receiver: 'nurse',
                    sender: 'doctor',
                    payload: {...peyload},
                    isCheckoutSync: response.isCheckoutSync
                  }),
                );
                // return;
              }
              if (
                response.sender === 'doctor' &&
                global.isPharmacyServerConnected
              ) {
                global.pharmacySocket.write(
                  JSON.stringify({
                    receiver: 'pharmacy',
                    payload: response.payload,
                    isCheckoutSync: response.isCheckoutSync
                  }),
                );
                // return;
              }
              ///////////////// From Pharmacy ////////////////////
              if (response.sender === 'pharmacy') {
                if (global.isServerConnected) {
                  global.socket.write(
                    JSON.stringify({
                      receiver: 'nurse',
                      sender: 'pharmacy',
                      payload: response.payload,
                    }),
                  );
                }
                if (global.isDoctorServerConnected) {
                  global.doctorSocket.write(
                    JSON.stringify({
                      receiver: 'doctor',
                      sender: 'pharmacy',
                      payload: response.payload,
                    }),
                  );
                }
                // return;
              }
              ///////////////// From Pharmacy ////////////////////
              let sender = response.sender;
              let isCheckoutSync = response.isCheckoutSync;
              let checkoutTime = response.payload?.CheckoutTime;
              if (response.sender === 'doctor') {
                let payload = response.payload;
                response = {
                  PatientId: payload.PatientId,
                  FirstName: payload.FirstName,
                  LastName: payload.LastName,
                  MRNNo: payload.MRNNo,
                  DOB: payload.DOB,
                  CNIC: '',
                  CellPhoneNumber: '',
                  Gender: payload.Gender,
                  SiteName: '',
                  MartialStatus: '',
                  SpouseName: '',
                  ZakatEligible: false,
                  Country: 'Pakistan',
                  City: '',
                  Province: '',
                  Address: '',
                  EnteredOn: '',
                  Services: [],
                  Status: payload.Status,
                  PrescriptionTime: payload.PrescriptionTime,

                  CheckInSynced: false,
                  NursingNote: '',
                  Vitals: [],
                };
                if (mmkvStorage.getString('medsAgainstPatients')) {
                  let prevMeds = JSON.parse(
                    mmkvStorage.getString('medsAgainstPatients'),
                  );
                  prevMeds.push({
                    PatientId: payload.PatientId,
                    Medications: payload.Medications,
                  });
                  mmkvStorage.set(
                    'medsAgainstPatients',
                    JSON.stringify(prevMeds),
                  );
                } else {
                  mmkvStorage.set(
                    'medsAgainstPatients',
                    JSON.stringify([
                      {
                        PatientId: payload.PatientId,
                        Medications: payload.Medications,
                      },
                    ]),
                  );
                }
              } else {
                response = response.payload;
              }
              if (response.Services) {
                let _services = [];
                response.Services.forEach(item => {
                  for (let i = 0; i < serviceStore.services.length; i++) {
                    if (item.ServiceId === serviceStore.services[i].ServiceId) {
                      _services.push(serviceStore.services[i]);
                    }
                  }
                });
                response.Services = _services;
              } else {
                response.Services = [];
              }
              let patients = patientStore.patientQueueForList();
              let indexToFind = patients.findIndex(
                item => item.PatientId === response.PatientId,
              );
              console.warn('index', indexToFind);
              if (indexToFind !== -1) {
                let updateresponse;
                if (sender === 'doctor') {
                  if(isCheckoutSync){
                    updateresponse = {
                      ...patients[indexToFind],
                      Status: 'CheckOut',
                      CheckoutTime: checkoutTime,
                    };
                  }else{
                    updateresponse = {
                      ...response,
                      ...patients[indexToFind],
                      Status: response.Status,
                      PrescriptionTime: response.PrescriptionTime,
                    };
                  }

                } else if (sender === 'pharmacy') {
                  updateresponse = {
                    ...response,
                    ...patients[indexToFind],
                    Status: response.Status,
                    PharmacyTime: response.PharmacyTime,
                  };
                } else {
                  updateresponse = response;
                }
                patientStore.modifyPatient(
                  updateresponse,
                  indexToFind,
                  setRefreshData,
                );
              } else {
                if(!isCheckoutSync){
                  patientStore.modifyPatientAndAddPatientInQueue(
                    response,
                    setRefreshData,
                    sender,
                  );
                }
              }
              // setTimeout(() => {
              // setRefreshData(!refreshData);
              // }, 2000);
              //   console.log('Server Received: ' + data);
              // socket.write('Echo server');
              // global.socket = socket;
            } catch (e) {
              console.warn('err', e);
            }
          });

          socket.on('error', error => {
            console.log('error ' + error);
            if (socket._id === global.doctorSocketId) {
              global.doctorSocket = null;
              global.doctorSocketId = null;
              global.isDoctorServerConnected = false;
              updateDoctorSocket(null);
              return;
            }
            if (socket._id === global.pharmacySocketId) {
              global.pharmacySocket = null;
              global.pharmacySocketId = null;
              global.isPharmacyServerConnected = false;
              updatePharmacySocket(null);
              return;
            }
            updateSocket(null);
            global.isServerConnected = false;
          });

          socket.on('close', error => {
            console.log('server client closed ', socket._id);
            if (socket._id === global.doctorSocketId) {
              global.doctorSocket = null;
              global.doctorSocketId = null;
              global.isDoctorServerConnected = false;
              updateDoctorSocket(null);
              return;
            }
            if (socket._id === global.pharmacySocketId) {
              global.pharmacySocket = null;
              global.pharmacySocketId = null;
              global.isPharmacyServerConnected = false;
              updatePharmacySocket(null);
              return;
            }
            updateSocket(null);
            global.isServerConnected = false;
          });
        })
        .listen(6666, () => {
          console.log(
            'opened server on ' + JSON.stringify(global.server.address()),
          );
        });

      global.server.on('error', error => {
        console.log('error ' + error);
        updateSocket(null);
        global.isServerConnected = false;
      });

      global.server.on('close', () => {
        console.log('server close');
        updateSocket(null);
        global.isServerConnected = false;
      });

      return global.server;
    } catch (e) {}
  };

  const resetConnection = () => {
    try {
      if (global.doctorSocket) {
        global.doctorSocket.destroy();
      }
      if (global.pharmacySocket) {
        global.pharmacySocket.destroy();
      }
      console.warn('global.socket', global.socket.destroy);
      if (global.socket) {
        global.socket.destroy();
      }
      global.server.close();
      global.isServerConnected = false;
      global.doctorSocket = null;
      global.doctorSocketId = null;
      global.isDoctorServerConnected = false;
      updateDoctorSocket(null);
      global.pharmacySocket = null;
      global.pharmacySocketId = null;
      global.isPharmacyServerConnected = false;
      updatePharmacySocket(null);
      updateSocket(null);
      setTimeout(() => {
        createServer();
      }, 4000);
    } catch (e) {
      console.warn('err::', e);
    }
  };
  // const refreshDataState=()=>{
  //   setRefreshData(!refreshData);
  // }
  // @demo remove-block-end
  return (
    <UserContext.Provider
      value={{
        socket,
        doctorSocket,
        pharmacySocket,
        refreshData,
        updateSocket,
        resetConnection,
        createServer,
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          navigationBarColor: colors.background,
        }}
        // initialRouteName={isAuthenticated ? "Home" : "Landing"} // @demo remove-current-line
      >
        {/* @demo remove-block-start */}
        {isAuthenticated ? (
          <>
            {/* @demo remove-block-end */}
            {/* <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} /> */}
            {/* @demo remove-block-start */}
            {/* <Stack.Screen name="Demo" component={DemoNavigator} /> */}
            <Stack.Screen name="Home" component={HomeNavigator} />
            <Stack.Screen name="Patient" component={PatientNavigator} />
            <Stack.Screen name="Profile" component={ProfileNavigator} />
            <Stack.Screen name="Landing" component={Screens.LandingScreen} />
            <Stack.Screen name="Sites" component={Screens.SitesScreen} />
            <Stack.Screen name="Login" component={Screens.LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Landing" component={Screens.LandingScreen} />
            <Stack.Screen name="Sites" component={Screens.SitesScreen} />
            <Stack.Screen name="Login" component={Screens.LoginScreen} />
            <Stack.Screen name="Home" component={HomeNavigator} />
            {/* <Stack.Screen name="Demo" component={DemoNavigator} /> */}
            <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
            <Stack.Screen name="Patient" component={PatientNavigator} />
            <Stack.Screen name="Profile" component={ProfileNavigator} />
          </>
        )}
        {/* @demo remove-block-end */}
        {
          // <>
          //   <Stack.Screen name="Login" component={Screens.LoginScreen} />
          // </>
        }
        {/** 🔥 Your screens go here */}
        {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
      </Stack.Navigator>
    </UserContext.Provider>
  );
});

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(
  props: NavigationProps,
) {
  const colorScheme = useColorScheme();

  useBackButtonHandler(routeName => exitRoutes.includes(routeName));

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}>
      <AppStack />
    </NavigationContainer>
  );
});
