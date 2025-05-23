import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {Service, ServiceModel} from './Service';
import {api} from 'app/services/api';
import {withSetPropAction} from './helpers/withSetPropAction';

export const ServiceStoreModel = types
  .model('ServiceStore')
  .props({
    services: types.array(ServiceModel),
    selectedService: types.array(types.reference(ServiceModel)),
    favorites: types.array(types.reference(ServiceModel)),
    favoritesOnly: false,
    totalAmount: 0,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetchServices() {
      if (store.services?.length === 0) {
        const response = await api.getServices();
        if (response.kind === 'ok') {
          store.setProp('services', response.services);
          console.log('response services.....', response.services);
          console.log('response store.....', store);
          console.log('response stores services.....', store.services);
        } else {
          return;
          console.tron.error(
            `Error fetching services: ${JSON.stringify(response)}`,
            [],
          );
        }
      }
    },
    selectService(service: Service) {
      store.selectedService.push(service);
      store.totalAmount = store.totalAmount + parseInt(service.Charges);
    },
    deselectService(service: Service) {
      store.selectedService.remove(service);
      store.totalAmount =
        store.totalAmount > 0
          ? store.totalAmount - parseInt(service.Charges)
          : store.totalAmount;
    },
    addFavorite(service: Service) {
      store.favorites.push(service);
    },
    removeFavorite(service: Service) {
      store.favorites.remove(service);
    },
    emptySelectedServices() {
      store.selectedService = undefined;
    },
    resetTotalAmount() {
      store.totalAmount = 0;
    },
  }))
  .views(store => ({
    get servicesForList() {
      // return store.favoritesOnly ? store.favorites : store.services
      console.log('Store Services...... in View', store);
      return store.services;
    },
    // get selectedService(){
    //   console.log('selected Service in view...', store.services)
    //   return store.selectedService
    // },
    hasFavorite(service: Service) {
      return store.favorites.includes(service);
    },
    serviceSelected(service: Service) {
      return store.selectedService.includes(service);
    },
  }))
  .actions(store => ({
    toggleFavorite(service: Service) {
      if (store.hasFavorite(service)) {
        store.removeFavorite(service);
      } else {
        store.addFavorite(service);
      }
    },
    toggleService(service: Service) {
      console.log('Service to select or deselect...', service);
      if (store.serviceSelected(service)) {
        store.deselectService(service);
      } else {
        store.selectService(service);
      }
    },
  }))
  .views(store => ({
    getServiceById(id: number) {
      return store.services.find(service => service.ServiceId === id);
    },
  }));

export interface ServiceStore extends Instance<typeof ServiceStoreModel> {}
export interface ServiceStoreSnapshot
  extends SnapshotOut<typeof ServiceStoreModel> {}

// @demo remove-file
