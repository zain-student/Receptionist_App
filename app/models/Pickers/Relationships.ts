import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  RelationshipId: number,
  Name: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const RelationshipsModel = types
  .model("Relationships")
  .props({
    RelationshipId: types.identifierNumber,
    Name: types.string
  })
  .actions(withSetPropAction)
  .views((relationship) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in RelationshipsModel', relationship)
      const defaultValue = { title: relationship.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Relationships extends Instance<typeof RelationshipsModel> {}
export interface RelationshipsSnapshotOut extends SnapshotOut<typeof RelationshipsModel> {}
export interface RelationshipsSnapshotIn extends SnapshotIn<typeof RelationshipsModel> {}

// @demo remove-file
