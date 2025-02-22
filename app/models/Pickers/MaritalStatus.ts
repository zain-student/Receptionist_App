import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  MaritalStatusId: number,
  Name: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const MaritalStatusModel = types
  .model("MaritalStatus")
  .props({
    MaritalStatusId: types.identifierNumber,
    Name: types.string
  })
  .actions(withSetPropAction)
  .views((maritalStatus) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in MaritalStatusModel', maritalStatus)
      const defaultValue = { title: maritalStatus.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface MaritalStatus extends Instance<typeof MaritalStatusModel> {}
export interface MaritalStatusSnapshotOut extends SnapshotOut<typeof MaritalStatusModel> {}
export interface MaritalStatusSnapshotIn extends SnapshotIn<typeof MaritalStatusModel> {}

// @demo remove-file
