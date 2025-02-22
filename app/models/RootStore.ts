import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {AuthenticationStoreModel} from './AuthenticationStore'; // @demo remove-current-line
import {EpisodeStoreModel} from './EpisodeStore'; // @demo remove-current-line
import {SiteStoreModel} from './SiteStore';
import {UserStoreModel} from './UserStore';
import {PickerStoreModel} from './PickerStore';
import {PatientStoreModel} from './PatientStore';
import {ServiceStoreModel} from './ServiceStore';
import {NewPatientModel} from './NewPatient';
import {NewPatientStoreModel} from './NewPatientStore';

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
  episodeStore: types.optional(EpisodeStoreModel, {}), // @demo remove-current-line
  siteStore: types.optional(SiteStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
  pickerStore: types.optional(PickerStoreModel, {}),
  patientStore: types.optional(PatientStoreModel, {}),
  newPatientStore: types.optional(NewPatientStoreModel, {}),
  serviceStore: types.optional(ServiceStoreModel, {}),
});

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
