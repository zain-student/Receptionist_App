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
  ImageBackground,
  Image,
} from 'react-native';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import {
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

interface LandingScreenProps extends AppStackScreenProps<'Landing'> {}

export const LandingScreen: FC<LandingScreenProps> = observer(
  function LandingScreen(_props) {
    const {navigation} = _props;

    // Pager........
    const width = Dimensions.get('window').width;
    const ref = React.useRef<PagerView>(null);
    const scrollOffsetAnimatedValue = React.useRef(
      new Animated.Value(0),
    ).current;
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

    const [site, setSite] = useState('');
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
        // safeAreaEdges={["top", "bottom"]}
      >
        <ImageBackground
          source={require('../../assets/images/background.png')}
          style={$screenContentContainer}>
          <ImageBackground
            source={require('../../assets/images/top_image.png')}
            style={$topImage}>
            <View style={$iconTextView}>
              <Icon icon="heart_icon" size={42} />
              <Text
                testID="app-title"
                tx={'landingScreen.appTitle'}
                preset="heading"
                style={[$pageTitle]}
              />
            </View>
          </ImageBackground>

          <View style={$iconTextView}>
            <Text
              testID="app-title"
              tx={'landingScreen.welcome'}
              preset="heading"
              style={[$welcomeText]}
            />
          </View>
          <View style={$iconTextView}>
            <Text
              testID="app-title"
              tx={'landingScreen.welcomeText'}
              preset="default"
              style={[$welcomeTextStyle]}
            />
          </View>
          {/* <View style={{ alignSelf: 'flex-end'}}>
       <ClickableText
          testID="login-button"
          tx="landingScreen.done"
          // style={$tapButton}
          preset="reversed"
          onPress={done}
        />
      </View> */}
          <View style={$loginButtonView}>
            <Text style={{color:'white',fontSize:12,alignSelf:'center'}}>Version: 2.0.0</Text>
<Text style={{color:'white',fontSize:12,alignSelf:'center'}}>Published: 28 May,2025</Text>
            <Button
              testID="login-button"
              tx="landingScreen.signIn"
              style={$tapButton}
              textStyle={$tapButtonText}
              preset="reversed"
              onPress={login}
            />
            <Text
              testID="app-title"
              tx={'landingScreen.poweredBy'}
              preset="default"
              style={[$welcomeTextStyle]}
            />
          </View>
        </ImageBackground>
      </Screen>
    );
    function login() {
      navigation.navigate('Sites');
    }
  },
);

const $containerStyle: ViewStyle = {
  flex: 1,
  height: '100%',
  width: '100%',
};

const $iconTextView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',
};

const $screenContentContainer: ViewStyle = {
  flex: 1,
};

const $imageBackground: ViewStyle = {
  flex: 1,
  width: '100%',
  height: '100%',
};

const $topImage: ViewStyle = {
  width: '100%',
  height: 287,
  alignItems: 'center',
  justifyContent: 'flex-end',
};

const $pageTitle: TextStyle = {
  padding: spacing.sm,
  textAlign: 'center',
  alignSelf: 'center',
  color: 'white',
  fontSize: 24,
};

const $welcomeText: TextStyle = {
  padding: spacing.sm,
  textAlign: 'center',
  alignSelf: 'center',
  fontSize: 31,
};

const $welcomeTextStyle: TextStyle = {
  fontSize: 18,
  paddingHorizontal: spacing.lg,
  color: 'white',
};

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
};

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
};

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
};

const $tapButton: ViewStyle = {
  backgroundColor: 'white',
  marginVertical: spacing.sm,
};

const $tapButtonText: TextStyle = {
  color: colors.themeText,
  fontSize: 18,
};

const $loginButtonView: ViewStyle = {
  position: 'absolute',
  bottom: spacing.xxl,
  width: '100%',
  padding: '4%',
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

// @demo remove-file
