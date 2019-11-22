import { Generator, File, namedCasex, casex, log } from 'battlecry'
import inquirer from 'inquirer'

const TYPES_PATHNAME = 'src/js/redux/types.js'
const REDUCER_PATHNAME = 'src/js/redux/reducers/__na-me__-reducer.js'
const ACTIONS_PATHNAME = 'src/js/redux/actions/__na-me__-actions.js'

export default class TypeGenerator extends Generator {
  config = {
    generate: {
      args: 'name'
    }
  };

  async generate() {
    await this.createOrModifyTypes()
  }

  async createOrModifyTypes () {
    const response = await inquirer.prompt({
      name: 'addSuccessAndFailure',
      message: 'Add success and failure types as well?',
      type: 'confirm',
      default: false
    })

    const { name } = this.args
    const typesToAdd = [name]

    const template = this.template('types.js')

    this.file = new File(TYPES_PATHNAME)
    if (!this.file.exists) {
      this.file = template
    }

    if (response.addSuccessAndFailure) {
      typesToAdd.push(
        `${name} success`,
        `${name} failure`
      )
    }

    this.addType(typesToAdd)

    this.file.saveAs(TYPES_PATHNAME)
  }

  addType (typesToAdd) {
    const lines = typesToAdd
      .map(name => {
        const typeName = namedCasex('__NA_ME__', name)
        const statement = namedCasex(
          `export const __NA_ME__ = '__NA_ME__'`,
          name
        )

        return { typeName, statement }
      })
      .filter(({ typeName, statement }) => {
        let typeDoesNotExist = true

        try {
          this.file.search(statement)
          log.warn(`type ${typeName} already exists`)
          typeDoesNotExist = false
        } catch (error) {
          log.success(`creating type ${typeName}`)
        }

        return typeDoesNotExist
      })

    this.file.after('// TYPES', lines.map(({ statement }) => statement))
  }
}
