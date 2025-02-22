import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { translate } from "../../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  LanguagesId: number,
  Name: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const LanguageModel = types
  .model("Language")
  .props({
    LanguagesId: types.identifierNumber,
    Name: types.string
  })
  .actions(withSetPropAction)
  .views((language) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in LanguageModel', language)
      const defaultValue = { title: language.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Language extends Instance<typeof LanguageModel> {}
export interface LanguageSnapshotOut extends SnapshotOut<typeof LanguageModel> {}
export interface LanguageSnapshotIn extends SnapshotIn<typeof LanguageModel> {}

// @demo remove-file
