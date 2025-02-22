import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  Id: number,
  CountryName: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const CountryModel = types
  .model("Country")
  .props({
    Id: types.identifierNumber,
    CountryName: types.string
  })
  .actions(withSetPropAction)
  .views((country) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in CountryModel', country)
      const defaultValue = { title: country.CountryName?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Country extends Instance<typeof CountryModel> {}
export interface CountrySnapshotOut extends SnapshotOut<typeof CountryModel> {}
export interface CountrySnapshotIn extends SnapshotIn<typeof CountryModel> {}

// @demo remove-file
