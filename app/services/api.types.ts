import {types} from '@babel/core';
import {string} from 'mobx-state-tree/dist/internal';

/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: {
    link: string;
    type: string;
    length: number;
    duration: number;
    rating: {scheme: string; value: string};
  };
  categories: string[];
}

export interface ApiFeedResponse {
  status: string;
  feed: {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
  };
  items: EpisodeItem[];
}

export interface SiteApiFeedResponse {
  data: [SiteItem[]];
  code: number;
  message: string;
  token: string;
  Error: string;
  ErrorList: string;
}

export interface SiteItem {
  SiteId: number;
  SiteName: string;
}

export interface UserApiFeedResponse {
  data: [UserItem[]];
  code: number;
  message: string;
  token: string;
  Error: string;
  ErrorList: string;
}

export interface UserItem {
  UserId: number;
  UserName: string;
  UserPassword: string;
  FullName: string;
  RoleId: number;
}

export interface PickerApiFeedResponse {
  data: [PickerItem[]];
  code: number;
  message: string;
  token: string;
  Error: string;
  ErrorList: string;
}

export interface PickerItem {
  Sites: [SitesItem[]];
  Cities: [CityItem[]];
  Countries: [CountriesItem[]];
  Provinces: [ProvincesItem[]];
  Gender: [GenderItem[]];
  MaritalStatuses: [MaritalStatusesItem[]];
  Languages: [LanguagesItem[]];
  Races: [RacesItem[]];
  Religions: [ReligionsItem[]];
  relationships: [RelationshipsItem[]];
  patientRelations: [PatientRelationsItem[]];
}

export interface SitesItem {
  SiteId: number;
  SiteName: string;
}

export interface CityItem {
  Id: number;
  ProvinceId: number;
  CityName: string;
}

export interface CountriesItem {
  Id: number;
  CountryName: string;
}

export interface ProvincesItem {
  Id: number;
  ProvinceName: string;
}

export interface GenderItem {
  GenderId: number;
  GenderName: string;
}

export interface MaritalStatusesItem {
  MaritalStatusId: number;
  Name: string;
}

export interface LanguagesItem {
  LanguagesId: number;
  Name: string;
}

export interface RacesItem {
  RaceId: number;
  Name: string;
}

export interface ReligionsItem {
  ReligionId: number;
  Name: string;
}

export interface RelationshipsItem {
  RelationshipId: number;
  Name: string;
}

export interface PatientRelationsItem {
  RelationId: number;
  RelationShipName: string;
}

export interface PatientApiFeedResponse {
  data: [PatientItem[]];
  code: number;
  message: string;
  token: string;
  Error: string;
  ErrorList: string;
}

export interface PatientItem {
  PatientId: number;
  FirstName: string;
  LastName: string;
  MRNNo: string;
  DOB: string;
  CNIC: string;
  CellPhoneNumber: string;
  Gender: string;
  SiteName: string;
  MartialStatus: string;
  SpouseName: string;
  ZakatEligible: boolean;
  Country: string;
  City: string;
  Province: string;
  Address: string;
  EnteredOn: string;
  isUserAdded?: boolean;
}

export interface ServiceApiFeedResponse {
  data: [ServiceItem[]];
  code: number;
  message: string;
  token: string;
  Error: string;
  ErrorList: string;
}

export interface ServiceItem {
  ServiceId: number;
  ServiceName: string;
  Charges: string;
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string;

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number;
}
