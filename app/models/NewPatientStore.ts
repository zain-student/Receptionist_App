import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {api} from '../services/api';
import {NewPatient, NewPatientModel} from './NewPatient';
import {Service, ServiceModel} from './Service';
import {withSetPropAction} from './helpers/withSetPropAction';

export const NewPatientStoreModel = types
  .model('NewPatientStore')
  .props({
    newPatients: types.array(NewPatientModel),

    // favorites: types.array(types.reference(NewPatientModel)),
    // favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetchPatients() {
      const response = await api.getPatients();
      if (response.kind === 'ok') {
        store.setProp('patients', response.patients);
        console.log('response patients.....', response.patients);
        console.log('response store.....', store);
        console.log('response stores patients.....', store.patients);
      } else {
        console.tron.error(
          `Error fetching patients: ${JSON.stringify(response)}`,
          [],
        );
      }
    },
    addNewPatient(newPatient: NewPatient) {
      store.newPatients.push(newPatient);
    },
    addAddressToNewPatient(
      address: string,
      country: string,
      province: string,
      city: string,
      index: number,
    ) {
      store.newPatients[index].Address = address;
      store.newPatients[index].Country = country;
      store.newPatients[index].Province = province;
      store.newPatients[index].City = city;
    },
    addContactToNewPatient(
      telephoneNo: string,
      mobileNo1: string,
      mobileNo2: string,
      index: number,
    ) {
      store.newPatients[index].TelephoneNo = telephoneNo;
      store.newPatients[index].CellPhoneNumber = mobileNo1;
      store.newPatients[index].MobileNo2 = mobileNo2;
    },
    addEmergencyContactToNewPatient(
      emergencyRelation: string,
      emergencyRelationName: string,
      emergencyContact: string,
      index: number,
    ) {
      store.newPatients[index].EmergencyRelation = emergencyRelation;
      store.newPatients[index].EmergencyRelationName = emergencyRelationName;
      store.newPatients[index].EmergencyRelationContact = emergencyContact;
    },
    removeNewPatientFromQueue(newPatient: NewPatient) {
      store.newPatients.remove(newPatient);
    },
  }))
  .views(store => ({
    get newPatientsForList() {
      // return store.favoritesOnly ? store.favorites : store.newPatients
      console.log('Store NewPatients...... in View', store);
      console.log('Store NewPatients...... in View', store.newPatients);
      console.log('Store NewPatients...... in View', store.newPatients.toJSON);

      return store.newPatients;
    },
    latestIndex() {
      return store.newPatients.length;
    },
    hasFavorite(newPatient: NewPatient) {
      return store.favorites.includes(newPatient);
    },
    getNewPatient(index: number) {
      return store.newPatients[index];
    },
    selectANewPatient(newPatient: NewPatient) {
      console.log(
        'newPatientSelected in store....',
        store.selectedNewPatient[0],
      );
      if (!store.newPatientSelected(newPatient))
        store.selectNewPatient(newPatient);
    },
  }))
  .actions(store => ({
    toggleFavorite(newPatient: NewPatient) {
      if (store.hasFavorite(newPatient)) {
        store.removeFavorite(newPatient);
      } else {
        store.addFavorite(newPatient);
      }
    },
  }));

export interface NewPatientStore
  extends Instance<typeof NewPatientStoreModel> {}
export interface NewPatientStoreSnapshot
  extends SnapshotOut<typeof NewPatientStoreModel> {}

// @demo remove-file
