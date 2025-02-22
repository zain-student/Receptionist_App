import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {api} from '../services/api';
import {Picker, PickerModel} from './Picker';
import {withSetPropAction} from './helpers/withSetPropAction';

export const PickerStoreModel = types
  .model('PickerStore')
  .props({
    pickers: types.array(PickerModel),
    // favorites: types.array(types.reference(PickerModel)),
    // favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetchPickers() {
      if (store.pickers?.length === 0) {
        const response = await api.getPickers();
        if (response.kind === 'ok') {
          store.setProp('pickers', response.pickers);
          console.log('response pickers.....', response.pickers);
          console.log('response store.....', store);
          console.log('response stores pickers.....', store.pickers);
        } else {
          return;
          console.tron.error(
            `Error fetching pickers: ${JSON.stringify(response)}`,
            [],
          );
        }
      }
    },
    addFavorite(picker: Picker) {
      store.favorites.push(picker);
    },
    removeFavorite(picker: Picker) {
      store.favorites.remove(picker);
    },
  }))
  .views(store => ({
    get getGenderForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].Gender;
      } else return [];
    },
    get getMaritalStatusForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].MaritalStatuses;
      } else return [];
    },
    get getRacesForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].Races;
      } else return [];
    },
    get getPatientRelationshipForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].patientRelations;
      } else return [];
    },
    get getReligionsForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].Religions;
      } else return [];
    },
    get getLanguagesForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].Languages;
      } else return [];
    },
    get getCountriesForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].Countries;
      } else return [];
    },
    get getProvincesForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].Provinces;
      } else return [];
    },
    get getCitiesForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].Cities;
      } else return [];
    },
    get getRelationshipForList() {
      if (store.pickers.length > 0) {
        return store.pickers[0].relationships;
      } else return [];
    },

    get pickersForList() {
      console.log('Store Pickers...... in View', store);
      return store.pickers;
    },

    hasFavorite(picker: Picker) {
      return store.favorites.includes(picker);
    },
  }))
  .actions(store => ({
    toggleFavorite(picker: Picker) {
      if (store.hasFavorite(picker)) {
        store.removeFavorite(picker);
      } else {
        store.addFavorite(picker);
      }
    },
  }));

export interface PickerStore extends Instance<typeof PickerStoreModel> {}
export interface PickerStoreSnapshot
  extends SnapshotOut<typeof PickerStoreModel> {}

// @demo remove-file
