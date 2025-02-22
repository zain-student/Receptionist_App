import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { City, CityModel } from "./Pickers/Cities"

import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
import { CountryModel } from "./Pickers/Countries"
import { GenderModel } from "./Pickers/Gender"
import { LanguageModel } from "./Pickers/Languages"
import { MaritalStatusModel } from "./Pickers/MaritalStatus"
import { ProvinceModel } from "./Pickers/Provinces"
import { RacesModel } from "./Pickers/Races"
import { ReligionsModel } from "./Pickers/Religions"
import { RelationshipsModel } from "./Pickers/Relationships"
import { PatientRelationsModel } from "./Pickers/PatientRelations"
import { SitesModel } from "./Pickers/Sites"

// import { types } from "@babel/core"

interface Enclosure {
  PickerId: number
  PickerName: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const PickerModel = types
  .model("Picker")
  .props({
    Cities: types.array(CityModel),
    Countries: types.array(CountryModel),
    Gender: types.array(GenderModel),
    Languages: types.array(LanguageModel),
    MaritalStatuses: types.array(MaritalStatusModel),
    Provinces: types.array(ProvinceModel),
    Races: types.array(RacesModel),
    Religions: types.array(ReligionsModel),
    relationships: types.array(RelationshipsModel),
    patientRelations: types.array(PatientRelationsModel),
    Sites: types.array(SitesModel)
  })
  .actions(withSetPropAction)
  .views((site) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in PickerModel', site)
      const defaultValue = { title: 
        // site.PickerName?.trim()
        '==='
        , subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Picker extends Instance<typeof PickerModel> {}
export interface PickerSnapshotOut extends SnapshotOut<typeof PickerModel> {}
export interface PickerSnapshotIn extends SnapshotIn<typeof PickerModel> {}

// @demo remove-file
