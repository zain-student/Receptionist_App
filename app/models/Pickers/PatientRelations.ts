import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  RelationId: number,
  RelationShipName: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const PatientRelationsModel = types
  .model("PatientRelations")
  .props({
    RelationId: types.identifierNumber,
    RelationShipName: types.string
  })
  .actions(withSetPropAction)
  .views((patientRelationship) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in PatientRelationsModel', patientRelationship)
      const defaultValue = { title: patientRelationship.RelationShipName?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface PatientRelations extends Instance<typeof PatientRelationsModel> {}
export interface PatientRelationsSnapshotOut extends SnapshotOut<typeof PatientRelationsModel> {}
export interface PatientRelationsSnapshotIn extends SnapshotIn<typeof PatientRelationsModel> {}

// @demo remove-file
