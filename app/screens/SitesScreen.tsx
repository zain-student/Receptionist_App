import {observer} from 'mobx-react-lite';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {
  TextInput,
  TextStyle,
  ViewStyle,
  View,
  Animated,
  Dimensions,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import {
  Toggle,
  EmptyState,
  Button,
  ClickableText,
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from '../components';
import {useStores} from '../models';
import {AppStackScreenProps} from '../navigators';
import {colors, spacing} from '../theme';
import {Site} from '../models/Site';
import {isRTL, translate} from '../i18n';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {
  ScalingDot,
  SlidingBorder,
  ExpandingDot,
  SlidingDot,
} from 'react-native-animated-pagination-dots';
import {styles} from './styles/landingScreenStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import Loading from 'app/components/Loading';

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const INTRO_DATA = [
  {
    key: '1',
    pageTitle: 'landingScreen.siteSelection',
    button: null,
    onPress: null,
    title: 'Site Selection ✨',
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  },
  {
    key: '2',
    pageTitle: 'landingScreen.appMode',
    button: 'landingScreen.checkSignals',
    title: 'App. Mode 🎉',
    description:
      "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. ",
  },
  {
    key: '3',
    pageTitle: 'landingScreen.devicePairing',
    button: 'landingScreen.search',
    title: 'Device Pairing 🎈',
    description:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ',
  },
];

const SITES = [
  {
    siteId: 1,
    siteName: 'Site1',
  },
  {
    siteId: 2,
    siteName: 'Site2',
  },
  {
    siteId: 3,
    siteName: 'Site3',
  },
  {
    siteId: 4,
    siteName: 'Site4',
  },
  {
    siteId: 5,
    siteName: 'Site5',
  },
  {
    siteId: 6,
    siteName: 'Site6',
  },
];

const DEVICES = [
  {
    deviceId: 1,
    deviceName: 'Nurse',
  },
  {
    deviceId: 2,
    deviceName: 'Doctor',
  },
  {
    deviceId: 3,
    deviceName: 'Pharmacist',
  },
];

interface SitesScreenProps extends AppStackScreenProps<'Landing'> {}

export const SitesScreen: FC<SitesScreenProps> = observer(function SitesScreen(
  _props,
) {
  const {navigation} = _props;

  // Pager........
  const width = Dimensions.get('window').width;
  const ref = React.useRef<PagerView>(null);
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [0, INTRO_DATA.length];
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, INTRO_DATA.length * width],
  });

  const onPageScroll = React.useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  // Pager........

  const authPasswordInput = useRef<TextInput>();
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const {
    authenticationStore: {appIsOnline, setAppIsOnline, validationError},
  } = useStores();
  const {siteStore} = useStores();

  const [siteItems, setSiteItems] = useState(siteStore.sitesForList);
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [site, setSite] = useState('');

  // const [site, setSite] = useState("")
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (siteStore.sitesForList.length == 0) {
      (async function load() {
        setIsLoading(true);
        await siteStore.fetchSites();
        setIsLoading(false);
      })();
    }
  }, [siteStore]);

  useEffect(() => {
    if (siteDropdownOpen && siteStore.sitesForList.length == 0) {
      (async function load() {
        setIsLoading(true);
        await siteStore.fetchSites();
        setIsLoading(false);
      })();
    }
    console.warn('siteDropdownOpen', siteDropdownOpen);
  }, [siteDropdownOpen, siteStore.sitesForList.length]);

  // simulate a longer refresh, if the refresh is too fast for UX
  async function manualRefresh() {
    setRefreshing(true);
    await Promise.all([siteStore.fetchSites(), delay(750)]);
    setRefreshing(false);
  }

  const rstyle = {
    borderColor: 'green',
    borderSize: 1,
  };

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Online',
        value: 'online',
      },
      {
        id: '0',
        label: 'Offline',
        value: 'offline',
      },
    ],
    [],
  );

  const error = isSubmitted ? validationError : '';

  function buttonPress() {
    console.log('-=-=-=-=-=-=-=-=-=-=-');
    // setIsSubmitted(true)
    // setAttemptsCount(attemptsCount + 1)

    // if (validationError) return

    // // Make a request to your server to get an authentication token.
    // // If successful, reset the fields and set the token.
    // setIsSubmitted(false)
    // setAuthPassword("")
    // setAuthEmail("")

    // // We'll mock this with a fake token.
    // setAuthToken(String(Date.now()))
  }

  function done() {
    if (site) {
      navigation.navigate('Login');
    } else {
      ToastAndroid.show('Must Select a Site first....', ToastAndroid.SHORT);
    }
  }

  function onSitePress(item) {
    console.log('=-=-=-=-=', item);
    siteStore.toggleSite(item);
    setSite(item);
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? 'view' : 'hidden'}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        );
      },
    [isAuthPasswordHidden],
  );

  // useEffect(() => {
  //   return () => {
  //     setAuthPassword("")
  //     setAuthEmail("")
  //   }
  // }, [])

  const SiteItem = ({item}) => (
    <>
      {/* {console.log('loging.....', item)} */}

      {console.log('loging.....', siteStore.siteSelected(item))}
      <Button
        onPress={() => onSitePress(item)}
        testID={`site-selection-list-button`}
        // key={key}
        style={[
          $siteButton,
          siteStore.siteSelected(item) && {
            backgroundColor: colors.palette.primary100,
          },
        ]}>
        <Text
          testID="login-heading"
          // tx={siteName}
          preset="bold"
          style={$pageTitle}>
          {item && item.SiteName ? item.SiteName : ''}
        </Text>
      </Button>
    </>
  );

  const DeviceItem = ({title}) => (
    <Text
      testID="login-heading"
      // tx={siteName}
      preset="bold"
      style={$devicesText}>
      {title}
    </Text>
  );
  // console.log('site Information.....', siteStore.sites)

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={['top', 'bottom']}>
      {/* <Loading isLoading={isLoading} /> */}
      <View>
        <Text
          testID="login-heading"
          tx={'sitesScreen.connectedTo'}
          preset="formLabel"
        />
        <View style={$connectedButtonsView}>
          <Button
            testID="login-button"
            tx={'sitesScreen.nurse'}
            style={$connectedTapButton}
            textStyle={$connectedButtonText}
            preset="reversed"
            onPress={buttonPress}
          />
          <Button
            testID="login-button"
            tx={'sitesScreen.doctor'}
            style={$connectedTapButton}
            textStyle={$connectedButtonText}
            preset="reversed"
            onPress={buttonPress}
          />
          <Button
            testID="login-button"
            tx={'sitesScreen.pharmacist'}
            style={$connectedTapButton}
            textStyle={$connectedButtonText}
            preset="reversed"
            onPress={buttonPress}
          />
        </View>
      </View>
      <View style={{marginTop: spacing.md}}>
        <Text
          testID="login-heading"
          tx={'sitesScreen.siteSelection'}
          preset="formLabel"
        />
        <View style={$connectedButtonsView}>
          <DropDownPicker
            schema={{
              label: 'SiteName',
              value: 'SiteName',
            }}
            searchable={true}
            placeholder="Site"
            open={siteDropdownOpen}
            value={site}
            items={siteItems}
            // items={(item) =>onSitePress(item)}
            setOpen={setSiteDropdownOpen}
            setValue={setSite}
            listMode="MODAL"
            onSelectItem={item => {
              onSitePress(item);
            }}
          />
        </View>
      </View>
      <View style={$toggleViewStyle}>
        <Text
          testID="login-heading"
          tx={'sitesScreen.appMode'}
          preset="formLabel"
        />
        <View style={{width: '40%'}}>
          <Toggle
            value={appIsOnline() == '1' ? true : false}
            onValueChange={item => {
              console.log('item.......', item);
              if (appIsOnline() == '1') setAppIsOnline('0');
              else setAppIsOnline('1');
            }}
            variant="switch"
            labelTx="sitesScreen.online"
            labelPosition="left"
            // labelStyle={$labelStyle}
            // accessibilityLabel={translate("demoPodcastListScreen.accessibility.switch")}
          />
        </View>
      </View>
      <View style={$loginButtonView}>
        <Button
          testID="login-button"
          tx="sitesScreen.submit"
          style={$tapButton}
          textStyle={$tapButtonText}
          preset="reversed"
          onPress={done}
        />
      </View>
    </Screen>
  );
});

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  flex: 1,
};

const $pageTitle: TextStyle = {
  padding: spacing.sm,
  textAlign: 'center',
  alignSelf: 'center',
};

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
};

const $tapButtonText: TextStyle = {
  color: 'white',
  fontSize: 18,
};

const $loginButtonView: ViewStyle = {
  width: '100%',
  justifyContent: 'center',
};

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
};

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
};

const $toggleViewStyle: ViewStyle = {
  marginTop: spacing.md,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const $tapButton: ViewStyle = {
  marginTop: spacing.md,
  alignSelf: 'center',
  width: '100%',
  backgroundColor: colors.themeText,
};

const $connectedTapButton: ViewStyle = {
  backgroundColor: colors.themeColorLight,
  borderColor: colors.themeText,
  borderWidth: 1,
  // marginStart: spacing.sm
};

const $connectedButtonText: TextStyle = {
  color: colors.themeText,
  fontSize: 15,
};

const $pagerView: ViewStyle = {
  flex: 1,
};

const $pagerInnerView: ViewStyle = {
  flex: 1,
  // borderWidth: 1,
  borderRadius: 10,
  elevation: 5,
  backgroundColor: colors.background,
  padding: spacing.sm,
  margin: spacing.sm,
};

const $siteButton: ViewStyle = {
  flex: 1,
  borderWidth: 0.5,
  borderRadius: 5,
  margin: spacing.sm,
  elevation: 8,
  backgroundColor: colors.background,
};

const $siteListView: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $devicesText: TextStyle = {
  padding: spacing.sm,
};

const $devicesListView: ViewStyle = {
  borderWidth: 1,
  width: '50%',
  alignSelf: 'center',
};

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
};

const $emptyStateImage: ImageStyle = {
  transform: [{scaleX: isRTL ? -1 : 1}],
};

const $connectedButtonsView: ViewStyle = {
  flexDirection: 'row',
  marginHorizontal: spacing.sm,
  justifyContent: 'space-between',
  marginTop: spacing.xs,
};
// @demo remove-file
