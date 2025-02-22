/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from 'apisauce';
import Config from '../config';
import {GeneralApiProblem, getGeneralApiProblem} from './apiProblem'; // @demo remove-current-line
import type {
  ApiConfig,
  SiteApiFeedResponse,
  UserApiFeedResponse,
  PickerApiFeedResponse,
  PatientApiFeedResponse,
  ServiceApiFeedResponse,
  ApiFeedResponse, // @demo remove-current-line
} from './api.types';
import type {EpisodeSnapshotIn} from '../models/Episode'; // @demo remove-current-line
import type {SiteSnapshotIn} from '../models/Site';
import type {UserSnapshotIn} from 'app/models/User';
import type {LoginSnapshotIn} from 'app/models/Login';
import type {PickerSnapshotIn} from 'app/models/Picker';
import type {PatientSnapshotIn} from 'app/models/Patient';
import type {ServiceSnapshotIn} from 'app/models/Service';

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
};

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance;
  config: ApiConfig;

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<
    {kind: 'ok'; episodes: EpisodeSnapshotIn[]} | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    );

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data;

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] = rawData.items.map(raw => ({
        ...raw,
      }));

      return {kind: 'ok', episodes};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }
  // @demo remove-block-end

  /**
   * Gets a list of all available sites.
   */
  async getSites(): Promise<
    {kind: 'ok'; sites: SiteSnapshotIn[]} | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<SiteApiFeedResponse> = await this.apisauce.get(
      `api/genral/GetAllSites`,
    );
    console.log('Site Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data.data[0];
      console.log('Site Api Raw Data....', rawData);

      // This is where we transform the data into the shape we expect for our MST model.

      const sites: SiteSnapshotIn[] = rawData.map(raw => ({
        ...raw,
      }));

      console.log('Site Api Response....2', sites);

      return {kind: 'ok', sites};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Gets a list of receptionist users.
   */
  async getUsers(): Promise<
    {kind: 'ok'; users: UserSnapshotIn[]} | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<UserApiFeedResponse> = await this.apisauce.get(
      `api/Auth/GetAllUsers?UserType=Receptionist`,
    );
    console.log('User Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data.data[0];
      console.log('User Api Raw Data....', rawData);

      // This is where we transform the data into the shape we expect for our MST model.

      const users: UserSnapshotIn[] = rawData.map(raw => ({
        ...raw,
      }));

      console.log('User Api Response....2', users);

      return {kind: 'ok', users};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Login user from server.
   */
  async loginUser(
    UserName: string,
    UserPassword: string,
  ): Promise<
    {kind: 'ok'; login: LoginSnapshotIn[]; token: string} | GeneralApiProblem
  > {
    // make the api call
    console.log('Login Api Response....', UserName + ', ' + UserPassword);

    const response: ApiResponse<UserApiFeedResponse> = await this.apisauce.post(
      `api/Auth/LoginUser`,
      {
        UserName: UserName,
        UserPassword: UserPassword,
      },
    );
    console.log('Login Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data;
      console.log('Login Api Raw Data....', rawData);

      // This is where we transform the data into the shape we expect for our MST model.

      // const login: LoginSnapshotIn[] = response.data
      const login: LoginSnapshotIn[] = rawData.data.map(raw => ({
        ...raw,
      }));

      console.log('Login Api Response....2', login);

      return {kind: 'ok', login, token: rawData.token};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Gets all dropdowns data.
   */
  async getPickers(): Promise<
    {kind: 'ok'; pickers: PickerSnapshotIn[]} | GeneralApiProblem
  > {
    // make the api call
    // this.apisauce.setHeader( 'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYTM1YzU5MS1lMDMyLTQ0YmMtYTBlNy04YTZmZmUzN2M2MWUiLCJ2YWxpZCI6IjEiLCJ1c2VyaWQiOiI1NiIsIm5hbWUiOiJtayB5b3VuYXMiLCJleHAiOjE2OTQ4MzY3NjQsImlzcyI6Imh0dHBzOi8vZW1yYXBpLnRlY2htZWRvbG9neS5jb20vIiwiYXVkIjoiaHR0cHM6Ly9lbXJhcGkudGVjaG1lZG9sb2d5LmNvbS8ifQ.-ikFsWho2JM94fg-vb49gj2_slq3C-GVUUAmWnW5O4g' )
    const response: ApiResponse<PickerApiFeedResponse> =
      await this.apisauce.get(`api/genral/GetAllDropdowns`);
    console.log('Picker Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data.data;
      console.log('Picker Api Raw Data....', rawData);

      // This is where we transform the data into the shape we expect for our MST model.

      const pickers: PickerSnapshotIn[] = rawData;

      // const pickers: PickerSnapshotIn[] = rawData.map((raw) => ({
      //   ...raw,
      // }))
      console.log('Picker Api Response....2', pickers);

      return {kind: 'ok', pickers};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Gets all Patients Data.
   */
  async getPatients(
    site,
  ): Promise<{kind: 'ok'; patients: PatientSnapshotIn[]} | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<PatientApiFeedResponse> =
      await this.apisauce.get(
        `api/Patient/GetPatientBySiteId?SiteId=` + site.SiteId,
      );
    // console.log('Patient Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      if (response.data?.data) {
        const rawData = response.data.data[0];
        // console.log('Patient Api Raw Data....', rawData);

        // This is where we transform the data into the shape we expect for our MST model.

        const patients: PatientSnapshotIn[] = rawData.map(raw => ({
          ...raw,
        }));

        // console.log('Patient Api Response....2', patients);

        return {kind: 'ok', patients};
      } else {
        return {kind: 'ok', patients: []};
      }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }

  /**
   * Gets a list of all services.
   */
  async getServices(): Promise<
    {kind: 'ok'; services: ServiceSnapshotIn[]} | GeneralApiProblem
  > {
    // make the api call
    const response: ApiResponse<ServiceApiFeedResponse> =
      await this.apisauce.get(`api/genral/GetAllServices`);
    console.log('Service Api Response....', response);

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data.data[0];
      console.log('Service Api Raw Data....', rawData);

      // This is where we transform the data into the shape we expect for our MST model.

      const services: ServiceSnapshotIn[] = rawData.map(raw => ({
        ...raw,
      }));

      console.log('Service Api Response....2', services);

      return {kind: 'ok', services};
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return {kind: 'bad-data'};
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api();
