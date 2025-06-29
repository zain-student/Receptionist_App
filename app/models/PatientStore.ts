import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {api} from '../services/api';
import {Patient, PatientModel} from './Patient';
import {Service, ServiceModel} from './Service';
import {withSetPropAction} from './helpers/withSetPropAction';
import {ToastAndroid} from 'react-native';
import moment from 'moment';
import { mmkvStorage } from './AuthenticationStore';
export const PatientStoreModel = types
  .model('PatientStore')
  .props({
    patients: types.array(PatientModel),
    selectedPatient: types.array(types.reference(PatientModel)),
    patientQueue: types.array(types.reference(PatientModel)),
    // favorites: types.array(types.reference(PatientModel)),
    // favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetchPatients(site) {
      const response = await api.getPatients(site);
      if (response.kind === 'ok') {
        let _patients = response.patients;
        // _patients.sort((a, b) => {
        //   return moment(b.EnteredOn).diff(moment(a.EnteredOn), 'hours');
        // });
        if (_patients.length > 500) {
          _patients = _patients.slice(0, 500);
        }
        let fileteredData = _patients.filter(item => {
          let exists = false;
          for (let i = 0; i < store.patients.length; i++) {
            if (item.PatientId === store.patients[i].PatientId) {
              exists = true;
            }
          }
          return !exists;
        });
        

        store.setProp('patients', fileteredData);
        console.log('response patients.....', response.patients?.length);
        // console.log('response store.....', store);
        // console.log('response stores patients.....', store.patients);
      } else {
        ToastAndroid.show(
          'Unable to retrieve patients data. Please try again.',
          ToastAndroid.LONG,
        );
        return;
        console.tron.error(
          `Error fetching patients: ${JSON.stringify(response)}`,
          [],
        );
      }
    },
    removePatients() {
      // store.patientQueue.clear();
      store.selectedPatient.clear();
      let fileteredData = store.patients.filter(item => {
        let exists = false;
        for (let i = 0; i < store.patientQueue.length; i++) {
          if (item.PatientId === store.patientQueue[i].PatientId) {
            exists = true;
          }
        }
        return exists;
      });
      // store.patientQueue.
      store.setProp('patients', JSON.parse(JSON.stringify(fileteredData)));
      // store.patients.clear();
    },
    addPatientInQueue(patient: Patient) {
      store.patientQueue.push(patient);
    },
    refreshPatientsList(patientData: any[]) {
      store.setProp('patients', patientData);
    },
    modifyPatient(
      patient: Patient,
      index: number,
      refreshData?: React.Dispatch<React.SetStateAction<string>>,
    ) {
      ////////
      let tempPatient1 = JSON.parse(JSON.stringify(store.patients));
      let inde = tempPatient1.findIndex(
        item => item.PatientId === patient.PatientId,
      );
      tempPatient1.splice(inde, 1);
      tempPatient1.push(patient);
      store.setProp('patients', tempPatient1);
      console.warn('first', JSON.stringify(store.patients.slice(-1)));
      if (refreshData) {
        refreshData(Math.random().toString());
      }
      // store.patientQueue.push(store.patients.slice(-1));
      // store.selectedPatient[0]=patient
      // addPatientInQueue
      /////////
      // setTimeout(() => {
      //   let tempPatient = JSON.parse(JSON.stringify(store.patientQueue));
      //   tempPatient.splice(index, 1);
      //   tempPatient.push(patient);
      //   store.setProp('patientQueue', tempPatient);
      // }, 1000);
      // store.patientQueue.remove(patient);
      // store.patientQueue.push(patient);
    },
    updateBasicInfoForPatient(
      firstName: string,
      lastName: string,
      mrnNo: string,
      dob: string,
      cnic: string,
      cellPhoneNumber: string,
      index: number,
      patientId: string,
    ) {
      const index1 = store.patients.findIndex(
        (p: any) => p.PatientId === patientId,
      );
      if (index1 !== -1) {
        const patient = store.patients[index1];
        patient.FirstName = firstName;
        patient.LastName = lastName;
        patient.MRNNo = mrnNo;
        patient.DOB = dob;
        patient.CNIC = cnic;
        patient.CellPhoneNumber = cellPhoneNumber;
      } else {
        console.warn(`Patient with ID ${patientId} not found.`);
      }
    },
    updateAddressForPatient(
      address: string,
      country: string,
      province: string,
      city: string,
      patientId: string,
    ) {
      const index = store.patients.findIndex(
        (p: any) => p.PatientId === patientId,
      );
      if (index !== -1) {
        const patient = store.patients[index];
        patient.Address = address;
        patient.Country = country;
        patient.Province = province;
        patient.City = city;
      } else {
        console.warn(`Patient with ID ${patientId} not found.`);
      }
    },

    modifyPatientAndAddPatientInQueue(
      patient: Patient,
      refreshData?: React.Dispatch<React.SetStateAction<string>>,
      sender?: string,
    ) {
      ////////
      let tempPatient1 = JSON.parse(JSON.stringify(store.patients));
      let inde = tempPatient1.findIndex(
        item => item.PatientId === patient.PatientId,
      );
      console.warn('inner', inde);
      if (inde !== -1) {
        let updateresponse;
        if (sender === 'doctor') {
          updateresponse = {
            ...patient,
            ...tempPatient1[inde],
            Status: patient.Status,
            PrescriptionTime: patient.PrescriptionTime,
          };
        } else if (sender === 'pharmacy') {
          updateresponse = {
            ...patient,
            ...tempPatient1[inde],
            Status: patient.Status,
            PharmacyTime: patient.PharmacyTime,
          };
        } else {
          updateresponse = patient;
        }
        store.patientQueue.push(store.patients[inde]);
        tempPatient1.splice(inde, 1);
        tempPatient1.push(patient);
        store.setProp('patients', tempPatient1);
        console.warn('first', JSON.stringify(store.patients.slice(-1)));
      } else {
        if (sender === 'pharmacy') {
          return;
        }
        tempPatient1.push(patient);
        store.setProp('patients', tempPatient1);
        console.warn('first', JSON.stringify(store.patients.slice(-1)));
        store.patientQueue.push(store.patients[store.patients.length - 1]);
      }
      if (refreshData) {
        refreshData(Math.random().toString());
      }
      // store.patientQueue.push(store.patients.slice(-1));
      // store.selectedPatient[0]=patient
      // addPatientInQueue
      /////////
      // setTimeout(() => {
      //   let tempPatient = JSON.parse(JSON.stringify(store.patientQueue));
      //   tempPatient.splice(index, 1);
      //   tempPatient.push(patient);
      //   store.setProp('patientQueue', tempPatient);
      // }, 1000);
      // store.patientQueue.remove(patient);
      // store.patientQueue.push(patient);
    },
    removePatientFromQueue(patient: Patient) {
      store.patientQueue.remove(patient);
    },
    selectPatient(patient: Patient) {
      store.selectedPatient[0] = patient;
    },
    deselectPatient(patient: Patient) {
      store.selectedPatient.remove(patient);
    },
    addFavorite(patient: Patient) {
      store.favorites.push(patient);
    },
    removeFavorite(patient: Patient) {
      store.favorites.remove(patient);
    },
    patientSelected(patient: Patient) {
      return store.selectedPatient.includes(patient);
    },
    getSelectedPatient() {
      return store.selectedPatient;
    },
    addSelectedPatientStatus(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].Status = status;
    },
    addCheckInTime(status: string) {
      console.log('inside add check in time....', status);
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].CheckInTime = status;
      console.log('inside check 2...', store.selectedPatient[0]);
      console.log('inside check 2...', store.selectedPatient[0].CheckInTime);
    },
    addVitalsTimeTime(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].VitalsTime = status;
    },
    addPrescriptionTimeTime(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].PrescriptionTime = status;
    },
    addPharmacyTime(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].PharmacyTime = status;
    },
    addCheckoutTime(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].CheckoutTime = status;
    },
    addServicesToSelectedPatient(services: Array<Service>) {
      console.log('selected Services list.......', services);
      for (let i = 0; i < services.length; i++) {
        if (store.selectedPatient.length > 0)
          console.log('selected Services list.......1', services[i]);
        console.log('selected Services list.......2', store.selectedPatient[0]);
        console.log(
          'selected Services list.......2',
          store.selectedPatient[0].Services,
        );

        // store.selectedPatient[0].Services = services
        if (!store.selectedPatient[0].Services.includes(services[i])) {
          store.selectedPatient[0].Services.push(services[i]);
          console.log(
            'selected Services list.......3',
            store.selectedPatient[0].Services,
          );
        }
      }
    },
    addCheckedInSynced(checkedInSynced: boolean) {
      if (store.selectedPatient[0])
        store.selectedPatient[0].CheckInSynced = checkedInSynced;
    },
    addNewPatient(patient: Patient) {
      console.log('patient in add new patient....', patient);
      const userAddedPatient = {
        ...patient,
        isUserAdded: true, // 🔒 Mark this patient as user-added
      };
      // store.patients.push(patient);
      console.log('Adding user-added patient:', userAddedPatient); // ✅ Confirm this
      store.patients.push(userAddedPatient);
      console.log('patient in add new patient....', store.patients);
    },
    addAddressToNewPatient(
      address: string,
      country: string,
      province: string,
      city: string,
      index: number,
    ) {
      store.patients[index].Address = address;
      store.patients[index].Country = country;
      store.patients[index].Province = province;
      store.patients[index].City = city;
    },
    selectNewPatient(index: number) {
      console.log('index in select New Patient....', index);
      console.log('index in select New Patient....', store.patients[index]);
      store.selectedPatient[0] = store.patients[index];
    },
    emptySelectedPatient() {
      store.selectedPatient.clear();
    },
  }))
  .views(store => ({
    get patientsForList() {
      // return store.favoritesOnly ? store.favorites : store.patients
      return store.patients;
    },
    patientQueueForList() {
      return store.patientQueue;
    },
    hasFavorite(patient: Patient) {
      return store.favorites.includes(patient);
    },
    selectAPatient(patient: Patient) {
      console.log('patientSelected in store....', store.selectedPatient[0]);
       const existing = store.patients.find(p => p.PatientId === patient.PatientId);
    if (!existing) {
      console.log('Adding missing API patient to store before selecting...');
      store.patients.push(patient); // Only add if truly missing
       ToastAndroid.show('Patient synced into list before selection ✅', ToastAndroid.SHORT);
    }
    if (!store.patientSelected(patient)) 
      {store.selectPatient(patient);
        ToastAndroid.show('Patient selected successfully ✅', ToastAndroid.SHORT);
      }
    else {
            ToastAndroid.show('Patient already selected', ToastAndroid.SHORT);
      }
    },
    latestIndex() {
      return store.patients.length;
    },
  }))
  .actions(store => ({
    toggleFavorite(patient: Patient) {
      if (store.hasFavorite(patient)) {
        store.removeFavorite(patient);
      } else {
        store.addFavorite(patient);
      }
    },
  }))
  .volatile(() => ({
    midnightResetTimer: null as ReturnType<typeof setTimeout> | null,
  }))
  .actions(store => ({
setupMidnightReset() {
  const now = new Date();
  const today = now.toDateString();
  console.log("1");
  



  const lastReset = mmkvStorage.getString('lastPatientReset');

  // if (lastReset !== today) {
  //   console.log('🔁 App opened after midnight — resetting now...');
  //   store.resetPatientsAtMidnight();
  // }
if (lastReset !== today) {
  console.log('🔁 App opened after midnight — resetting now...');
  setTimeout(() => {
    store.resetPatientsAtMidnight(); // ✅ Delayed reset avoids conflicts
  }, 1000); // Delay by 1s
}
const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
const msUntilMidnight = midnight.getTime() - now.getTime();

  // const msUntilMidnight = 30000; // 30 seconds for test
  const resetTime = new Date(Date.now() + msUntilMidnight);
  console.log('⏰ Scheduled patient reset at', resetTime.toLocaleTimeString());

  // ✅ Clear any previous timer
  if (store.midnightResetTimer)
     clearTimeout(store.midnightResetTimer);

  store.midnightResetTimer = setTimeout(() => {
    console.log("🚨 Timeout triggered");
    store.resetPatientsAtMidnight();
    store.setupMidnightReset();
  }, msUntilMidnight);
},


  resetPatientsAtMidnight() {
    console.log('⏱️ Midnight reached — resetting patient queue.');
    store.patientQueue.clear();
    store.selectedPatient.clear();
    // ✅ Save the reset date
    mmkvStorage.set('lastPatientReset', new Date().toDateString());
    ToastAndroid.show('⏱️ Midnight reached — resetting patient queue.',ToastAndroid.LONG);
  }
}));


export interface PatientStore extends Instance<typeof PatientStoreModel> {}
export interface PatientStoreSnapshot
  extends SnapshotOut<typeof PatientStoreModel> {}

// @demo remove-file