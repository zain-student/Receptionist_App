import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  GenderId: number,
  GenderName: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const GenderModel = types
  .model("Gender")
  .props({
    GenderId: types.identifierNumber,
    GenderName: types.string
  })
  .actions(withSetPropAction)
  .views((gender) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in GenderModel', gender)
      const defaultValue = { title: gender.GenderName?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Gender extends Instance<typeof GenderModel> {}
export interface GenderSnapshotOut extends SnapshotOut<typeof GenderModel> {}
export interface GenderSnapshotIn extends SnapshotIn<typeof GenderModel> {}

// @demo remove-file
