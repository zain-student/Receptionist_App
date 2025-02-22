import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  SiteId: number
  SiteName: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const SitesModel = types
  .model("Sites")
  .props({
    SiteId: types.identifierNumber,
    SiteName: types.string
  })
  .actions(withSetPropAction)
  .views((race) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in SitesModel', race)
      const defaultValue = { title: race.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Sites extends Instance<typeof SitesModel> {}
export interface SitesSnapshotOut extends SnapshotOut<typeof SitesModel> {}
export interface SitesSnapshotIn extends SnapshotIn<typeof SitesModel> {}

// @demo remove-file
