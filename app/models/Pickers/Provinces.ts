import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  Id: number,
  ProvinceName: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const ProvinceModel = types
  .model("Province")
  .props({
    Id: types.identifierNumber,
    ProvinceName: types.string,
    CountryId: types.number
  })
  .actions(withSetPropAction)
  .views((province) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in ProvinceModel', province)
      const defaultValue = { title: province.ProvinceName?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Province extends Instance<typeof ProvinceModel> {}
export interface ProvinceSnapshotOut extends SnapshotOut<typeof ProvinceModel> {}
export interface ProvinceSnapshotIn extends SnapshotIn<typeof ProvinceModel> {}

// @demo remove-file
