import React, {FC, useState, useEffect} from 'react';
import {
  TextInput,
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
import {useStores} from '../models';
import {ageCalculator} from 'app/models/helpers/dateHelpers';
import DropDownPicker from 'react-native-dropdown-picker';

const ADV_SEARCH_DROPDOWN = [
  {
    id: 1,
    label: 'MRN',
    value: 'MRN',
  },
  {
    id: 2,
    label: 'First Name',
    value: 'FirstName',
  },
  {
    id: 3,
    label: 'Last Name',
    value: 'LastName',
  },
  // {
  //   id: 4,
  //   label: 'Date',
  //   value: 'Date'
  // },
  {
    id: 5,
    label: 'Cell No',
    value: 'CellNo',
  },
  {
    id: 6,
    label: 'CNIC',
    value: 'CNIC',
  },
  {
    id: 7,
    label: 'Gender',
    value: 'Gender',
  },
  {
    id: 8,
    label: 'Spouse Name',
    value: 'SpouseName',
  },
];

const PATIENTS = [
  {
    patientId: 1,
    patientName: 'Patient 1',
  },
  {
    patientId: 2,
    patientName: 'Patient 2',
  },
  {
    patientId: 3,
    patientName: 'Patient 3',
  },
  {
    patientId: 4,
    patientName: 'Patient 4',
  },
  {
    patientId: 5,
    patientName: 'Patient 5',
  },
  {
    patientId: 6,
    patientName: 'Patient 6',
  },
  {
    patientId: 7,
    patientName: 'Patient 7',
  },
  {
    patientId: 8,
    patientName: 'Patient 8',
  },
  {
    patientId: 9,
    patientName: 'Patient 9',
  },
  {
    patientId: 10,
    patientName: 'Patient 10',
  },
  {
    patientId: 11,
    patientName: 'Patient 11',
  },
  {
    patientId: 12,
    patientName: 'Patient 12',
  },
  {
    patientId: 13,
    patientName: 'Patient 13',
  },
  {
    patientId: 14,
    patientName: 'Patient 14',
  },
  {
    patientId: 15,
    patientName: 'Patient 15',
  },
  {
    patientId: 16,
    patientName: 'Patient 13',
  },
  {
    patientId: 17,
    patientName: 'Patient 14',
  },
  {
    patientId: 18,
    patientName: 'Patient 15',
  },
];

export const PatientSearchScreen: FC<HomeTabScreenProps<'PatientSearch'>> =
  function PatientSearchScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation} = _props;

    const {patientStore} = useStores();
    const [patients, setPatients] = useState('');
    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [data, setData] = useState([]);
    const [query, setQuery] = useState('');

    const [showAdvSearch, setShowAdvSearch] = useState(false);
    const [advanceSearchItems, setAdvanceSearchItems] =
      useState(ADV_SEARCH_DROPDOWN);
    const [advanceSearchDropdownOpen, setAdvanceSearchDropdownOpen] =
      useState(false);
    const [advanceSearch, setAdvanceSearch] = useState([]);
    const {siteStore} = useStores();

    useEffect(() => {
      if (patientStore.latestIndex() == 0) {
        (async function load() {
          setIsLoading(true);
          await patientStore.fetchPatients(siteStore.getSelectedSite());
          setIsLoading(false);
        })();
      }
    }, [patientStore]);

    // simulate a longer refresh, if the refresh is too fast for UX
    async function manualRefresh() {
      setRefreshing(true);
      await Promise.all([
        patientStore.fetchPatients(siteStore.getSelectedSite()),
        delay(750),
      ]);
      setRefreshing(false);
    }

    //     const PatientItem = ({item}) => (
    //       <TouchableOpacity
    //         onPress={()=>onItemPress(item)}
    //         style={{borderWidth: 1}}>
    //         <Text testID="login-heading"
    //           preset="bold"
    //           style={$patientsText}
    //           >
    //           {item.FirstName + ' ' + item.LastName}
    //         </Text>
    //       </TouchableOpacity>
    // )

    const PatientItem = ({item}) => (
      <TouchableOpacity
        style={$patientItemView}
        onPress={() => onItemPress(item)}>
        <View style={$patientItemTitleView}>
          <Text testID="login-heading" preset="bold" style={$patientTitleText}>
            {'MRN ' + item.MRNNo}
          </Text>
        </View>
        <Text
          testID="login-heading"
          preset="bold"
          style={[$patientsText, {color: colors.palette.primary600}]}>
          {item.FirstName + ' ' + item.LastName}
        </Text>
        <Text testID="login-heading" preset="bold" style={$patientsText}>
          {
            // item.MRNNo + ' | ' +
            item.Gender + ' | ' + ageCalculator(item.DOB)
          }
        </Text>
      </TouchableOpacity>
    );

    function patientItemPress(title: React.SetStateAction<string>) {
      console.log('-=-=-=-=-=-=-=-=-', title);
      console.log('-=-=-=-=-=-=-=-=-');
      setPatient(title);
    }

    function addNewPress() {
      navigation.navigate('Profile');
    }

    function advanceSearchPress() {
      if (patientStore.latestIndex() > 0) {
        setShowAdvSearch(!showAdvSearch);
      }
      // navigation.navigate("PatientAdvanceSearch")
    }

    function onItemPress(item: any) {
      console.log('-=-=-=-=-=-=-=', item);
      patientStore.selectAPatient(item);
      navigation.navigate('Patient');
    }

    const handleSearch = text => {
      const formattedQuery = text.toLowerCase();
      const filteredData = patientStore.patientsForList.filter(item => {
        if (showAdvSearch) {
          switch (advanceSearch) {
            case 'MRN':
              console.log('Search by,.....MRN....', advanceSearch);
              return item.MRNNo.toLowerCase().includes(formattedQuery);
              break;
            case 'FirstName':
              console.log('Search by,.....FirstName....', advanceSearch);
              return item.FirstName.toLowerCase().includes(formattedQuery);
              break;
            case 'LastName':
              console.log('Search by,.....LastName....', advanceSearch);
              return item.LastName.toLowerCase().includes(formattedQuery);
              break;
            case 'CellNo':
              console.log('Search by,.....CellPhoneNumber....', advanceSearch);
              return item.CellPhoneNumber.toLowerCase().includes(
                formattedQuery,
              );
              break;
            case 'CNIC':
              console.log('Search by,.....CNIC....', advanceSearch);
              return item.CNIC.toLowerCase().includes(formattedQuery);
              break;
            case 'Gender':
              console.log('Search by,.....Gender....', advanceSearch);
              return item.Gender.toLowerCase().includes(formattedQuery);
              break;
            case 'SpouseName':
              console.log('Search by,.....SpouseName....', advanceSearch);
              return item.SpouseName.toLowerCase().includes(formattedQuery);
              break;
            default:
              return false;
              break;
          }
        } else return item.MRNNo.toLowerCase().includes(formattedQuery);
      });
      setData(filteredData);
      setQuery(text);
    };

    console.log('patients list....', patientStore.patientsForList);
    return (
      <Screen
        preset="fixed"
        contentContainerStyle={$container}
        safeAreaEdges={['top']}>
        <Text
          preset="heading"
          tx="patientSearchScreen.patientSearch"
          style={$title}
        />
        {showAdvSearch ? (
          <View style={$dropdownView}>
            <DropDownPicker
              style={$dropdown}
              placeholder="Select Advance Search Options"
              listMode="MODAL"
              open={advanceSearchDropdownOpen}
              value={advanceSearch}
              items={advanceSearchItems}
              setOpen={setAdvanceSearchDropdownOpen}
              setValue={setAdvanceSearch}
            />
          </View>
        ) : null}
        {patientStore.latestIndex() > 0 ? (
          <View style={$patientsListView}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              value={query}
              onChangeText={queryText => handleSearch(queryText)}
              placeholder="Search"
              style={$patientSearch}
            />
            <FlatList
              data={query ? data : patientStore.patientsForList}
              // style={$patientsListView}
              extraData={query ? data : patientStore.patientsForList}
              renderItem={({item}) => <PatientItem item={item} />}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <View style={$patientsListView}>
            <Text
              preset="subheading"
              tx="patientSearchScreen.noPatientFound"
              style={$title}
            />
          </View>
        )}
        <View style={$buttonsView}>
          <Button
            testID="login-button"
            tx={'patientSearchScreen.advanceSearch'}
            style={[$tapButton, {backgroundColor: colors.palette.accent500}]}
            textStyle={{color: colors.text}}
            preset="reversed"
            onPress={advanceSearchPress}
          />
          <Button
            testID="login-button"
            tx={'patientSearchScreen.addNew'}
            style={[$tapButton, {backgroundColor: 'green'}]}
            preset="reversed"
            onPress={addNewPress}
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
  textAlign: 'center',
};

const $patientsListView: ViewStyle = {
  flex: 6,
  // borderWidth: 1,
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
  // paddingHorizontal: spacing.sm
};

const $patientSearch: ViewStyle = {
  backgroundColor: colors.palette.accent100,
  paddingHorizontal: 20,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  elevation: 5,
};

const $dropdown: ViewStyle = {
  backgroundColor: colors.palette.accent100,
  paddingHorizontal: 20,
  elevation: 5,
};

const $dropdownView: ViewStyle = {
  width: '100%',
  marginBottom: spacing.sm,
  elevation: 10,
  // zIndex: 10,
  // paddingHorizontal: 15
};
// @home remove-file
