import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  RaceId: number,
  Name: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const RacesModel = types
  .model("Races")
  .props({
    RaceId: types.identifierNumber,
    Name: types.string
  })
  .actions(withSetPropAction)
  .views((race) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in RacesModel', race)
      const defaultValue = { title: race.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Races extends Instance<typeof RacesModel> {}
export interface RacesSnapshotOut extends SnapshotOut<typeof RacesModel> {}
export interface RacesSnapshotIn extends SnapshotIn<typeof RacesModel> {}

// @demo remove-file
