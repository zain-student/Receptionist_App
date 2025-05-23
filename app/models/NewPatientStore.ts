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
    // addBasicInfoToNewPatient(
    //   firstName: string,
    //   lastName: string,
    //   mrnNo: string,
    //   dob: string,
    //   cnic: string,
    //   cellPhoneNumber: string,
    //   index: number,
    //   patientStore: any, // or use the proper type if available
    // ) {
    //   const patient = store.newPatients[index];

    //   if (!patient) {
    //     console.warn(`No patient found at index ${patientIndex}`);
    //     return;
    //   }

    //   patient.FirstName = firstName;
    //   patient.LastName = lastName;
    //   patient.MRNNo = mrnNo;
    //   patient.DOB = dob;
    //   patient.CNIC = cnic;
    //   patient.CellPhoneNumber = cellPhoneNumber;

    //   // Only call this if needed and safe
    //   if (patientStore?.updateBasicInfoForPatient) {
    //     patientStore.updateBasicInfoForPatient(
    //       firstName,
    //       lastName,
    //       mrnNo,
    //       dob,
    //       cnic,
    //       cellPhoneNumber,
    //     );
    //   }
    // },

    // addAddressToNewPatientAndUpdateMainStore(
    //   address: string,
    //   country: string,
    //   province: string,
    //   city: string,
    //   index: number,
    //   patientId: string,
    //   patientStore: any, // import the type if needed
    // ) {
    //   store.newPatients[index].Address = address;
    //   store.newPatients[index].Country = country;
    //   store.newPatients[index].Province = province;
    //   store.newPatients[index].City = city;

    //   // Also update the main PatientStore
    //   patientStore.updateAddressForPatient(
    //     address,
    //     country,
    //     province,
    //     city,
    //     patientId,
    //   );
    // },
    // updateNewPatient(patientId: number, updatedFields: Partial<NewPatient>) {
    //   // const patient = store.newPatients[index];
    //   const patient = store.newPatients.find(p => p.PatientId === patientId);
    //   console.log('updateNewPatient in store....', patient);
    //   console.log('updateNewPatient in store....', updatedFields);
    //   console.log('updateNewPatient in store....', patientId);
    //   console.log('updateNewPatient in store....', store.newPatients);
    //   if (!patient) {
    //     console.warn(`No patient found with patientId ${patientId}`);
    //     return;
    //   }

    //   // Object.assign(patient, updatedFields);
    //   const {PatientId: _, ...safeFields} = updatedFields; // Avoid changing the ID
    //   Object.assign(patient, safeFields);
    // },
    // updateNewPatient(patientIndex: number, updatedFields: Partial<NewPatient>) {
    //   const patients = store.newPatients;
    //   console.log('Patient array length: ', patients.length);
    //   console.log('Patient array: ', patients);
    //   if (patientIndex < 0 || patientIndex >= patients.length) {
    //     console.warn(`Invalid PatientIndex: ${patientIndex}`);
    //     return;
    //   }

    //   const patient = patients[patientIndex];

    //   const {PatientId: _, ...safeFields} = updatedFields; // Prevent identifier update
    //   Object.assign(patient, safeFields);
    // },
    // updateNewPatient(patientIndex: number, updatedFields: Partial<NewPatient>) {
    //   const patients = store.newPatients;
    //   console.log('Patient array length: ', patients.length);
    //   console.log('Patient array: ', patients);

    //   if (patientIndex < 0 || patientIndex >= patients.length) {
    //     console.warn(`Invalid PatientIndex: ${patientIndex}`);
    //     return;
    //   }

    //   const patient = patients[patientIndex];

    //   const {PatientId: _, ...safeFields} = updatedFields;

    //   // Optional: Convert number fields to strings if the MST model expects strings
    //   const sanitizedFields = {
    //     ...safeFields,
    //     Country:
    //       safeFields.Country !== undefined
    //         ? String(safeFields.Country)
    //         : undefined,
    //     Province:
    //       safeFields.Province !== undefined
    //         ? String(safeFields.Province)
    //         : undefined,
    //     City:
    //       safeFields.City !== undefined ? String(safeFields.City) : undefined,
    //     Gender:
    //       safeFields.Gender !== undefined
    //         ? String(safeFields.Gender)
    //         : undefined,
    //     MartialStatus:
    //       safeFields.MartialStatus !== undefined
    //         ? String(safeFields.MartialStatus)
    //         : undefined,
    //   };

    //   try {
    //     Object.assign(patient, sanitizedFields);
    //   } catch (error) {
    //     console.error('Failed to update patient:', error);
    //   }
    //   console.log('Updated patient*********:', patient);
    // },
    updateNewPatient(patientIndex: number, updatedFields: Partial<NewPatient>) {
      const patients = store.newPatients;
      if (patientIndex < 0 || patientIndex >= patients.length) {
        console.warn(`Invalid PatientIndex: ${patientIndex}`);
        return;
      }
    
      const patient = patients[patientIndex];
      const { PatientId: _, ...safeFields } = updatedFields;
    
      // Handle Services field properly
      if (safeFields.Services !== undefined) {
        // If Services is an array of plain objects or IDs, convert to MST references or instances here
        if (safeFields.Services === null) {
          patient.Services = null;
        } else if (Array.isArray(safeFields.Services)) {
          // Assuming you have a serviceStore that holds all Service instances
          // Convert IDs or raw objects to MST Service model references
          patient.Services = safeFields.Services.map(serviceItem => {
            if (typeof serviceItem === "number") {
              // If serviceItem is an ID, get the service model from store
              return store.serviceStore.getServiceById(serviceItem);
            } else if (serviceItem?.id) {
              // If it's an object with an id, get from store or create reference
              return store.serviceStore.getServiceById(serviceItem.id);
            }
            return serviceItem; // fallback: assume it's already a reference
          }).filter(Boolean); // remove nulls if any
        } else {
          // Unexpected format, ignore or log warning
          console.warn("Unexpected Services format in updatedFields");
        }
    
        // Remove Services from safeFields so Object.assign doesn't overwrite incorrectly
        delete safeFields.Services;
      }
    
      // Assign other fields safely (with necessary type conversions if needed)
      Object.assign(patient, safeFields);
    }
    
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
