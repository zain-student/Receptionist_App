const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out", // @demo remove-current-line
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!", // @demo remove-current-line
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "",
    // friendlySubtitle:
    // "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack", // @demo remove-current-line
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
    noDataFound: "No Data Found"
  },
  // @demo remove-block-start
  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    signIn: "FD  Sign In",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Username",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your user name",
    passwordFieldPlaceholder: "Secret password here",
    tapToSignIn: "Tap to sign in!",
    hint: "Hint: you can sign in with your existing username & password :)",
  },
  demoNavigator: {
    componentsTab: "Components",
    debugTab: "Debug",
    communityTab: "Community",
    podcastListTab: "Podcast",
  },
  demoCommunityScreen: {
    title: "Connect with the community",
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: "Join us on Slack",
    joinUsOnSlack:
      "Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.",
    joinSlackLink: "Join the Slack Community",
    makeIgniteEvenBetterTitle: "Make Ignite even better",
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: "Contribute to Ignite",
    theLatestInReactNativeTitle: "The latest in React Native",
    theLatestInReactNative: "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "Hire Infinite Red for your next project",
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: "Send us a message",
  },
  demoShowroomScreen: {
    jumpStart: "Components to jump start your project!",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  demoPodcastListScreen: {
    title: "React Native Radio episodes",
    onlyFavorites: "Only Show Favorites",
    favoriteButton: "Favorite",
    unfavoriteButton: "Unfavorite",
    accessibility: {
      cardHint:
        "Double tap to listen to the episode. Double tap and hold to {{action}} this episode.",
      switch: "Switch on to only show favorites",
      favoriteAction: "Toggle Favorite",
      favoriteIcon: "Episode not favorited",
      unfavoriteIcon: "Episode favorited",
      publishLabel: "Published {{date}}",
      durationLabel: "Duration: {{hours}} hours {{minutes}} minutes {{seconds}} seconds",
    },
    noFavoritesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No favorites have been added yet. Tap the heart on an episode to add it to your favorites!",
    },
  },
  // @demo remove-block-end
  homeScreen: {
    homeScreen: "Home Screen",
    fd: 'Front Desk (FD)'
  },
  landingScreen: {
    appTitle: 'RECEPTIONIST',
    welcome: 'Welcome to EMR App',
    welcomeText: 'Elevate patients’ check-in and invoice making experience with digital receptionist',
    signIn: 'SIGN IN',
    poweredBy: 'Powered by Techmedo (Pvt.) Ltd.',
    siteSelection: "Site Selection",
    appMode: "App. Mode",
    devicePairing: "Device Pairing",
    checkSignals: "Check Signals",
    search: "Search",
    done: "Done"
  },
  sitesScreen: {
    connectedTo: 'Connected to....',
    nurse: 'Nurse',
    doctor: 'Doctor',
    pharmacist: 'Pharmacist',
    siteSelection: 'Site Selection',
    online: 'Online',
    appMode: 'App Mode',
    submit: 'Submit'
  },
  homeNavigator: {
    homeScreen: "Home",
    patientSearch: "Search",
    todaysPatients: "Patients",
    patientStatus: "Status",
    signOut: "Sign Out"
  },
  patientSearchScreen: {
    patientSearch: "Patient Search",
    advanceSearch: "Adv. Search",
    addNew: "Add New",
    noPatientFound: "No Patient Found"
  },
  patientAdvanceSearchScreen: {
    searchBy: "Search By",
    search: "Search",
    mrn: "MRN",
    fname: "First Name",
    lname: "Last Name",
    fDate: "From Date",
    toDate: "To Date",
    cellNo: "Cell No.",
    cnic: "CNIC",
    city: "City",
    gender: "Gender"
  },
  profileBasicInfoScreen: {
    basicInfo: 'Basic Info',
    gender: 'Gender',
    maritalStatus: 'Marital Status',
    dob: 'Date of Birth',
    ethinicity: 'Ethinicity',
    relationship: 'Relationship to Patient',
    nameOfRelative: 'Name of Relative',
    religion: 'Relition',
    spokenTongue: 'Spoken Tongue',
    zakatEligibility: 'Zakat Eligibility',
    save: 'Save',
    },

  addressInfoScreen: {
    addressInfo: 'Address Info',
    address: 'Address',
    province: 'Province',
    city: 'City',
    district: 'District',
    },

  contactInfoScreen: {
    contactInfo: 'Contact Info',
    telephoneNo: 'Telephone No.',
    mobileNo1: 'Mobile No. 1',
    mobileNo2: 'Mobile No. 2',
    },

  emergencyContactInfo: {
    emergencyContact: 'Emergency Contact',
    nextOfKin: 'Next of Kin (Relative)',
    nextOfKinName: 'Next of Kin Name',
    nextOfKinContact: 'Next of Kin Contact',
  },

  patientConsentScreen: {
    patientConsent: 'Patient Consent',
    submit: 'Submit'
  },

  todaysPatientsScreen: {
    todaysPatients: 'Today\'s Patients',
    submit: 'Submit'
  },

  patientStatusScreen: {
    patientStatus: 'Patient Status'
  },

  patientServicesScreen: {
    services: 'Services',
    submit: 'Submit',
    collectCash: 'Collect Cash '
  },

  cashCollectionScreen: {
    cashCollection: 'Cash Collection',
    totalAmount: 'Total Amount: ',
    collected: 'Collected'
  },

  optionsScreen: {
    selectNextPatient: 'Select Next Patient',
    syncData: 'Sync Data',
    nextOrSyncData: 'Next Patient or Sync Data'
  },

  syncDataScreen: {
    syncData: 'Sync Data Now',
  }, 

}

export default en
export type Translations = typeof en
