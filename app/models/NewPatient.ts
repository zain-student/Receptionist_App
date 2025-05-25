import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';
import {withSetPropAction} from './helpers/withSetPropAction';
import {formatDate} from '../utils/formatDate';
import {translate} from '../i18n';
import {ServiceModel, Service} from './Service';
// import { types } from "@babel/core"

interface Enclosure {
  PatientId: number;
  FirstName: string;
  LastName: string;
  MRNNo: string;
  DOB: string;
  CNIC: string;
  CellPhoneNumber: string;
  Gender: string;
  SiteName: string;
  99;
  MartialStatus: string;
  SpouseName: string;
  ZakatEligible: boolean;
  Country: string;
  City: string;
  Province: string;
  Address: string;
  EnteredOn: string;
  Services: [];
  Status: string;
  CheckInSynced: boolean;

  Ethnicity: string;
  RelationToPatient: string;
  NameOfRelative: string;
  Religion: string;
  SpokenTongue: string;

  TelephoneNo: string;
  //MobileNo1 to be saved in CellPhoneNumber
  MobileNo2: string;
  isUserAdded?: boolean;
}

/**
 * This represents an episode of React Native Radio.
 */
export const NewPatientModel = types
  .model('NewPatient')
  .props({
    PatientId: types.identifierNumber,
    FirstName: types.string,
    LastName: types.string,
    MRNNo: types.string,
    DOB: types.string,
    CNIC: types.string,
    CellPhoneNumber: types.string,
    Gender: types.string,
    SiteName: types.string,
    MartialStatus: types.string,
    SpouseName: types.string,
    ZakatEligible: types.boolean,
    Country: types.string,
    City: types.string,
    Province: types.string,
    Address: types.string,
    EnteredOn: types.string,
    Services: types.maybeNull(types.array(types.reference(ServiceModel))),
    Status: types.maybeNull(types.string),
    CheckInSynced: types.maybeNull(types.boolean),
    isUserAdded: types.maybeNull(types.boolean),
    Ethnicity: types.string,
    RelationToPatient: types.string,
    NameOfRelative: types.string,
    Religion: types.string,
    SpokenTongue: types.string,

    TelephoneNo: types.string,
    //MobileNo1 to be saved in CellPhoneNumber
    MobileNo2: types.string,

    EmergencyRelation: types.string,
    EmergencyRelationName: types.string,
    EmergencyRelationContact: types.string,
  })
  .actions(withSetPropAction)
  //.........
  // .actions(self => ({
  //   setMRN(newMRN: string) {
  //     self.MRNNo = newMRN;
  //   },
  // }))
  // ........
  .views(patient => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in NewPatientModel', patient);
      const defaultValue = {title: patient.FirstName?.trim(), subtitle: ''};

      console.log('-=-=-=-= in Default Value', defaultValue);

      if (!defaultValue.title) return defaultValue;

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/);

      if (!titleMatches || titleMatches.length !== 3) return defaultValue;

      return {title: titleMatches[1], subtitle: titleMatches[2]};
    },
  }));

export interface NewPatient extends Instance<typeof NewPatientModel> {}
export interface NewPatientSnapshotOut
  extends SnapshotOut<typeof NewPatientModel> {}
export interface NewPatientSnapshotIn
  extends SnapshotIn<typeof NewPatientModel> {}

// @demo remove-file
