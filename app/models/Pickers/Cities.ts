import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  Id: number,
  ProvinceId: number,
  CityName: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const CityModel = types
  .model("City")
  .props({
    Id: types.identifierNumber,
    ProvinceId: types.number,
    CityName: types.string
  })
  .actions(withSetPropAction)
  .views((city) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in CityModel', city)
      const defaultValue = { title: city.CityName?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface City extends Instance<typeof CityModel> {}
export interface CitySnapshotOut extends SnapshotOut<typeof CityModel> {}
export interface CitySnapshotIn extends SnapshotIn<typeof CityModel> {}

// @demo remove-file
