import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  ReligionId: number,
  Name: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const ReligionsModel = types
  .model("Religions")
  .props({
    ReligionId: types.identifierNumber,
    Name: types.string
  })
  .actions(withSetPropAction)
  .views((religion) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in ReligionsModel', religion)
      const defaultValue = { title: religion.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Religions extends Instance<typeof ReligionsModel> {}
export interface ReligionsSnapshotOut extends SnapshotOut<typeof ReligionsModel> {}
export interface ReligionsSnapshotIn extends SnapshotIn<typeof ReligionsModel> {}

// @demo remove-file
