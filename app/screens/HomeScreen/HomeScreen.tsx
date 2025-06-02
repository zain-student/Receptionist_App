import {
  Link,
  RouteProp,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import React, {
  FC,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  GestureResponderEvent,
  Image,
  ImageStyle,
  NativeEventSubscription,
  Platform,
  SectionList,
  TextStyle,
  ToastAndroid,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {DrawerLayout, DrawerState} from 'react-native-gesture-handler';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {Header, Icon, ListItem, Screen, Text} from '../../components';
import {isRTL} from '../../i18n';
import {
  HomeTabParamList,
  HomeTabScreenProps,
} from '../../navigators/HomeNavigator';
import {colors, spacing} from '../../theme';
import {useSafeAreaInsetsStyle} from '../../utils/useSafeAreaInsetsStyle';
import * as Homes from './DrawerScreens';
import {DrawerIconButton} from './DrawerIconButton';
import {useStores} from '../../models';
import {ProfileIconButton} from './ProfileIconButton';
import {UserContext} from 'app/utils/UserContext';
import QrCodePopup from 'app/components/QRCodePopup';
import {fetch} from '@react-native-community/netinfo';
import Loading from 'app/components/Loading';
import { observer } from 'mobx-react-lite';
const logo = require('../../../assets/images/logo.png');

const MENU = [
  {
    id: 1,
    name: 'Patient Search',
    data: [],
    icon: 'button_search',
  },
  {
    id: 2,
    name: 'Add New Patient',
    data: [],
    icon: 'button_search',
  },
  {
    id: 3,
    name: "Today's Patients",
    data: [],
    icon: 'button_search',
  },
  {
    id: 4,
    name: 'Patient Status',
    data: [],
    icon: 'button_search',
  },
  // {
  //   id: 5,
  //   name: 'Services',
  //   data: [],
  //   icon: 'button_search'
  // },
  // {
  //   id: 6,
  //   name: 'Cash Collection',
  //   data: []
  // },
  {
    id: 8,
    name: 'QR Code',
    data: [],
  },
  {
    id: 7,
    name: 'Signout',
    data: [],
    icon: 'button_search',
  },
];

export interface Home {
  name: string;
  description: string;
  data: ReactElement[];
}

interface HomeListItem {
  item: {name: string; useCases: string[]};
  sectionIndex: number;
  menuPressed?: (sectionIndex: number, itemIndex?: number) => void;
  drawerMenuPressed?: (item) => void;
}

const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const WebListItem: FC<HomeListItem> = ({item, sectionIndex}) => {
  const sectionSlug = item.name.toLowerCase();

  return (
    <View>
      <Link to={`/showroom/${sectionSlug}`} style={$menuContainer}>
        <Text preset="bold">{item.name}</Text>
      </Link>
      {item.useCases.map(u => {
        const itemSlug = slugify(u);

        return (
          <Link
            key={`section${sectionIndex}-${u}`}
            to={`/showroom/${sectionSlug}/${itemSlug}`}>
            <Text>{u}</Text>
          </Link>
        );
      })}
    </View>
  );
};

const NativeListItem: FC<HomeListItem> = ({
  item,
  sectionIndex,
  menuPressed,
}) => {
  // console.log('item............', item)
  return (
    <View>
      <Text
        onPress={() => menuPressed(sectionIndex)}
        preset="bold"
        style={$menuContainer}>
        {item.name}
      </Text>
      {item.useCases.map((u, index) => (
        <ListItem
          key={`section${sectionIndex}-${u}`}
          onPress={() => menuPressed(sectionIndex, index + 1)}
          text={u}
          rightIcon={isRTL ? 'caretLeft' : 'caretRight'}
        />
      ))}
    </View>
  );
};

const MenuButtonListItem: FC<HomeListItem> = ({
  item,
  sectionIndex,
  menuPressed,
  drawerMenuPressed,
}) => {
  if (item.name !== 'Signout')
    return (
      <TouchableOpacity
        onPress={() => drawerMenuPressed(item)}
        style={$menuButtonContainer}>
        <Icon
          icon={
            item.name == 'Patient Search'
              ? 'button_search'
              : item.name == 'Add New Patient'
              ? 'button_add'
              : item.name == "Today's Patients"
              ? 'button_queue'
              : item.name == 'Patient Status'
              ? 'button_status'
              : item.name == 'Services'
              ? 'button_services'
              : 'button_logout'
          }
          // color={focused && colors.tint}
          size={90}
        />
        <Text
          numberOfLines={2}
          // onPress={() => menuPressed(sectionIndex)}
          // onPress={() => drawerMenuPressed(item)}
          style={{fontSize: 10}}
          preset="default">
          {item.name}
        </Text>
        {item.useCases.map((u, index) => (
          <ListItem
            key={`section${sectionIndex}-${u}`}
            onPress={() => menuPressed(sectionIndex, index + 1)}
            text={u}
            rightIcon={isRTL ? 'caretLeft' : 'caretRight'}
          />
        ))}
      </TouchableOpacity>
    );
  else return null;
};
const ShowroomListItem = Platform.select({
  web: WebListItem,
  default: NativeListItem,
});
let qrdata = '';
let backhandler: NativeEventSubscription;

export const HomeScreen: FC<HomeTabScreenProps<'Home'>> =observer( function HomeScreen(
  _props,
) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const drawerRef = useRef<DrawerLayout>();
  const listRef = useRef<SectionList>();
  const menuRef = useRef<FlatList>();
  const progress = useSharedValue(0);
  const route = useRoute<RouteProp<HomeTabParamList, 'Home'>>();
  const params = route.params;
  const {pickerStore} = useStores();
  const [isLoading, setIsLoading] = React.useState(true);
  const {siteStore} = useStores();
  const [showQrCodeScanner, setshowQrCodeScanner] = React.useState(false);
  const [totalPatients, setTotalPatients] = useState<number>(0); // State to hold the total number of patients in OPD

  const {
    authenticationStore: {logout, appIsOnline},
    patientStore,
    serviceStore,
  } = useStores();

  const userContext = useContext(UserContext);

  useEffect(() => {}, [pickerStore]);

  useFocusEffect(
    useCallback(() => {
      if (appIsOnline() == '1') {
        (async function load() {
          // setIsLoading(true);
          console.warn('loading started');
          await pickerStore.fetchPickers();
          await serviceStore.fetchServices();
          // if (patientStore.latestIndex() == 0) {
          //   await patientStore.fetchPatients(siteStore.getSelectedSite());
          // }
          // console.warn('first', patientStore.latestIndex());
          // setTimeout(() => {
          setIsLoading(false);
          // }, 1000);
        })();
      }
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      backhandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backHandlerCallback,
      );
      return () => {
        if (backhandler) {
          backhandler.remove();
        }
      };
    }, []),
  );

  useEffect(() => {
    return () => {
      if (backhandler) {
        backhandler.remove();
      }
    };
  }, []);
  // handle Web links
  React.useEffect(() => {
    if (route.params) {
      const homeValues = Object.values(Homes);
      const findSectionIndex = homeValues.findIndex(
        x => x.name.toLowerCase() === params.queryIndex,
      );
      let findItemIndex = 0;
      if (params.itemIndex) {
        try {
          findItemIndex =
            homeValues[findSectionIndex].data.findIndex(
              u => slugify(u.props.name) === params.itemIndex,
            ) + 1;
        } catch (err) {
          console.error(err);
        }
      }
      menuPressed(findSectionIndex, findItemIndex);
    }
  }, [route]);

  const backHandlerCallback = () => {
    BackHandler.exitApp();
    return true;
  };

  const toggleDrawer = () => {
    if (!open) {
      setOpen(true);
      drawerRef.current?.openDrawer({speed: 2});
    } else {
      setOpen(false);
      drawerRef.current?.closeDrawer({speed: 2});
    }
    // let data = {
    //   Address: 'koohi goth',
    //   CNIC: '11111-1111111-1',
    //   CellPhoneNumber: '03232816108',
    //   CheckInSynced: false,
    //   CheckInTime: '23-03-2024 04:51 PM',
    //   CheckoutTime: null,
    //   City: 'Karachi',
    //   Country: 'Pakistan',
    //   DOB: '1/1/2019 12:00:00 AM',
    //   EnteredOn: '2023-11-08T12:50:24.383',
    //   FirstName: 'Azan ',
    //   Gender: 'Female',
    //   LastName: 'Shah zaib',
    //   MRNNo: '01-02-0101568',
    //   MartialStatus: 'Single',
    //   NursingNote: 'vhh',
    //   PatientId: 101568,
    //   PharmacyTime: null,
    //   PrescriptionTime: null,
    //   Province: 'Azad Kashmir',
    //   Services: [
    //     {Charges: '40', ServiceId: 30013, ServiceName: 'Doctor Consultation'},
    //     {Charges: '10', ServiceId: 30037, ServiceName: 'Card Fee'},
    //   ],
    //   SiteName: 'KGH',
    //   SpouseName: 'Shah zaib',
    //   Status: 'Vitals',
    //   Vitals: [
    //     {
    //       BMI: '55',
    //       'BMI Status': '6',
    //       'BP Diastolic': '66',
    //       'BP Systolic': '56',
    //       Height: '59',
    //       Pulse: '56',
    //       'R/R': '55',
    //       SpO2: '55',
    //       Temp: '55',
    //       'Waist Circumference': '99',
    //       Weight: '55',
    //     },
    //   ],
    //   VitalsTime: 'Mar 23, 2024 05:02 PM',
    //   ZakatEligible: false,
    //   status: 'Vitals',
    // };
    // let _services = [];
    // data.Services.forEach(item => {
    //   for (let i = 0; i < serviceStore.services.length; i++) {
    //     if (item.ServiceId === serviceStore.services[i].ServiceId) {
    //       _services.push(serviceStore.services[i]);
    //     }
    //   }
    // });
    // data.Services = _services;
    // console.warn('updated');
    // let patients = patientStore.patientQueueForList();
    // let indexToFind = patients.findIndex(
    //   item => item.PatientId === data.PatientId,
    // );
    // console.warn('index', indexToFind);
    // if (indexToFind !== -1) {
    //   patientStore.modifyPatient(data, indexToFind);
    // } else {
    //   patientStore.modifyPatientAndAddPatientInQueue(data);
    // }
  };

  const profilePress = () => {
    // console.log('Profile pressed.......')
  };
  const onShowQrCodeScanner = async () => {
    fetch()
      .then(state => {
        console.log('Connection type', state.type);
        console.log(
          'Is connected?',
          state.isConnected,
          state.details?.ipAddress,
        );
        //@ts-ignore
        if (state.details?.ipAddress) {
          //@ts-ignore
          qrdata = state.details?.ipAddress;
          setshowQrCodeScanner(true);
        } else {
          ToastAndroid.show(
            'Make sure you are connected to wifi',
            ToastAndroid.LONG,
          );
        }
      })
      .catch(err => {
        console.warn('err', err);
        ToastAndroid.show(
          'Make sure you are connected to wifi',
          ToastAndroid.LONG,
        );
      });
  };

  const onHideQrCodeScanner = async () => {
    setshowQrCodeScanner(false);
  };

  const menuPressed = (sectionIndex: number, itemIndex) => {
    console.log('item.........in press button', itemIndex);
    console.log('item.........in press button', MENU[sectionIndex]);
    const item = MENU[sectionIndex];
    if (item.name == 'Signout') {
      try {
        _props.navigation.navigate('Landing');
        patientStore.removePatients();
        global.isLogin = false;
        logout();
      } catch (err) {}
    } else if (item.name == 'Patient Search') {
      if (appIsOnline() == '1') {
        if (patientStore.latestIndex() == 0) {
          (async function load() {
            setIsLoading(true);
            await patientStore.fetchPatients(siteStore.getSelectedSite());
            setIsLoading(false);
          });
        }
      }
      _props.navigation.navigate('PatientSearch');
    } else if (item.name == 'Services') {
      if (appIsOnline() == '1' && patientStore.latestIndex() == 0) {
        (async function load() {
          setIsLoading(true);
          await serviceStore.fetchServices();
          setIsLoading(false);
        });
      }
      _props.navigation.navigate('Patient');
    } else if (item.name == "Today's Patients") {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Add New Patient') {
      _props.navigation.navigate('Profile');
    } else if (item.name == 'QR Code') {
      onShowQrCodeScanner();
    }
    if (open) toggleDrawer();
  };

  const drawerMenuPressed = item => {
    console.log('item.drawer menu........in press button', item);
    // _props.navigation.navigate('Patient')
    if (item.name == 'Signout') {
      logout();
      _props.navigation.navigate('Landing');
    } else if (item.name == 'Patient Search') {
      if (appIsOnline() == '1') {
        if (patientStore.latestIndex() == 0) {
          (async function load() {
            setIsLoading(true);
            await patientStore.fetchPatients(siteStore.getSelectedSite());
            setIsLoading(false);
          });
        }
      }
      _props.navigation.navigate('PatientSearch');
    } else if (item.name == 'Services') {
      if (appIsOnline() == '1' && patientStore.latestIndex() == 0) {
        (async function load() {
          setIsLoading(true);
          await serviceStore.fetchServices();
          setIsLoading(false);
        });
      }
      _props.navigation.navigate('Patient');
    } else if (item.name == "Today's Patients") {
      _props.navigation.navigate('TodaysPatients');
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Patient Status') {
      _props.navigation.navigate('PatientStatus');
    } else if (item.name == 'Add New Patient') {
      _props.navigation.navigate('Profile');
    }
    if (open) toggleDrawer();
  };

  const listItemPressed = item => {
    console.log('item.........in press button', item);
    _props.navigation.navigate(item.key);
    toggleDrawer();
  };
  const scrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    listRef.current?.getScrollResponder()?.scrollToEnd();
    timeout.current = setTimeout(
      () =>
        listRef.current?.scrollToLocation({
          animated: true,
          itemIndex: info.index,
          sectionIndex: 0,
        }),
      50,
    );
  };

  useEffect(() => {
    return () => timeout.current && clearTimeout(timeout.current);
  }, []);
  // This will fetch the total number of the OPD patients and will set it to the state
  useFocusEffect(
    useCallback(() => {
      if (appIsOnline() === '1') {
        (async function load() {
          await pickerStore.fetchPickers();
          await serviceStore.fetchServices();

          // Fetch patients if needed
          // await patientStore.fetchPatients(siteStore.getSelectedSite());

          // Set total OPD patients
          setTotalPatients(patientStore.patientQueueForList().length);

          setIsLoading(false);
        })();
      }
    }, []),
  );

  const $drawerInsets = useSafeAreaInsetsStyle(['top']);

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={Platform.select({
        default: 326,
        web: Dimensions.get('window').width * 0.3,
      })}
      drawerType={'slide'}
      drawerPosition={isRTL ? 'right' : 'left'}
      overlayColor={open ? colors.palette.overlay20 : 'transparent'}
      onDrawerSlide={drawerProgress => {
        progress.value = open ? 1 - drawerProgress : drawerProgress;
      }}
      onDrawerStateChanged={(
        newState: DrawerState,
        drawerWillShow: boolean,
      ) => {
        if (newState === 'Settling') {
          progress.value = withTiming(drawerWillShow ? 1 : 0, {
            duration: 250,
          });
          setOpen(drawerWillShow);
        }
      }}
      renderNavigationView={() => (
        <View style={[$drawer, $drawerInsets]}>
          <View style={$logoContainer}>
            <Image source={logo} style={$logoImage} />
          </View>
          <FlatList<{name: string; useCases: string[]}>
            ref={menuRef}
            contentContainerStyle={$flatListContentContainer}
            // data={Object.values(Homes).map((d) => ({
            //   name: d.name,
            //   useCases: d.data.map((u) => u.props.name),
            // }))}
            data={MENU.map(d => ({
              name: d.name,
              useCases: d.data.map(u => u.props.name),
            }))}
            keyExtractor={item => item.name}
            renderItem={({item, index: sectionIndex}) => (
              <ShowroomListItem {...{item, sectionIndex, menuPressed}} />
            )}
          />
        </View>
      )}>
      <Header
        LeftActionComponent={
          <DrawerIconButton onPress={toggleDrawer} {...{open, progress}} />
        }
        isHome={true}
        RightActionComponent={<ProfileIconButton onPress={profilePress} />}
      />
      <QrCodePopup
        onHideQrCodeScanner={onHideQrCodeScanner}
        showQrCodeScanner={showQrCodeScanner}
        qrdata={qrdata}
      />
      <Loading isLoading={isLoading} />
      <Screen
        preset="fixed"
        //  safeAreaEdges={["top"]}
        contentContainerStyle={$screenContainer}>
        <Text
          style={{
            paddingHorizontal: '5%',
            color: userContext.socket ? '#0CABF0' : 'black',
          }}>
          Nurse: {userContext.socket ? 'Connected' : 'Not Connected'}
        </Text>
        <Text
          style={{
            paddingHorizontal: '5%',
            color: userContext.doctorSocket ? '#0CABF0' : 'black',
          }}>
          Doctor: {userContext.doctorSocket ? 'Connected' : 'Not Connected'}
        </Text>
        <Text
          style={{
            paddingHorizontal: '5%',
            color: userContext.pharmacySocket ? '#0CABF0' : 'black',
          }}>
          Pharmacy: {userContext.pharmacySocket ? 'Connected' : 'Not Connected'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            userContext.resetConnection();
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 3000);
          }}>
          <Text
            style={{
              paddingHorizontal: '5%',
              color: 'red',
              alignSelf: 'flex-end',
              fontSize: 12,
            }}>
            Reset Connection
          </Text>
        </TouchableOpacity>
        <FlatList<{name: string; useCases: string[]}>
          ref={menuRef}
          contentContainerStyle={$flatListContentContainer}
          // data={Object.values(Homes).map((d) => ({
          //   name: d.name,
          //   useCases: d.data.map((u) => u.props.name),
          // }))}
          numColumns={2}
          data={MENU.map(d => ({
            name: d.name,
            useCases: d.data.map(u => u.props.name),
          }))}
          keyExtractor={item => item.name}
          renderItem={({item, index: sectionIndex}) => (
            <>
              {item.name !== 'QR Code' && (
                <MenuButtonListItem
                  {...{item, sectionIndex, menuPressed, drawerMenuPressed}}
                />
              )}
            </>
          )}
          style={{marginTop: spacing.md}}
        />
        {/* This will display the total number of todays patients in the OPD */}
        <View style={{alignItems: 'center', marginVertical: spacing.xxl}}>
          <Text preset="bold" size="xl">
            Total OPD Patients: {totalPatients}
          </Text>
        </View>
        {/* <SectionList
            ref={listRef}
            contentContainerStyle={$sectionListContentContainer}
            stickySectionHeadersEnabled={false}
            sections={Object.values(Homes)}
            renderItem={({ item }) => item}
            renderSectionFooter={() => <View style={$homeUseCasesSpacer} />}
            ListHeaderComponent={
              <View style={$heading}>
                <Text preset="heading" tx="HomeScreen.jumpStart" />
              </View>
            }
            onScrollToIndexFailed={scrollToIndexFailed}
            renderSectionHeader={({ section }) => {
              return (
                <View>
                  <Text preset="heading" style={$homeItemName}>
                    {section.name}
                  </Text>
                  <Text style={$homeItemDescription}>{section.description}</Text>
                </View>
              )
            }}
          /> */}
      </Screen>
    </DrawerLayout>
  );
});

// function ProfileIconButton(onPress) {
//   return (
//     <TouchableOpacity
//       // onPress={}
//       style={$profileView}
//     >
//       <Text preset="formLabel" tx="homeScreen.fd" style={{ marginHorizontal: spacing.sm }} />
//       <Icon
//         icon={"profile"}
//         // color={focused && colors.tint}
//         size={32}
//       />
//     </TouchableOpacity>
//   )
// }

const $screenContainer: ViewStyle = {
  flex: 1,
};

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
};

const $profileView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: spacing.sm,
};

const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.sm,
};

const $sectionListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
};

const $heading: ViewStyle = {
  marginBottom: spacing.xxxl,
};

const $logoImage: ImageStyle = {
  height: 42,
  width: 177,
};

const $logoContainer: ViewStyle = {
  alignSelf: 'flex-start',
  justifyContent: 'center',
  height: 56,
  paddingHorizontal: spacing.lg,
};

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
};

const $menuButtonContainer: ViewStyle = {
  flex: 1,
  margin: spacing.sm,
  borderRadius: 5,
  elevation: 5,
  backgroundColor: colors.background,
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.lg,
  width: '40%',
  minHeight: 150,
};

const $homeItemName: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.md,
};

const $homeItemDescription: TextStyle = {
  marginBottom: spacing.xxl,
};

const $homeUseCasesSpacer: ViewStyle = {
  paddingBottom: spacing.xxl,
};

// @home remove-file
