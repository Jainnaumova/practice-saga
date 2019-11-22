import { Generator, File, namedCasex, casex, log } from 'battlecry';
import inquirer from 'inquirer'

const ROOT_REDUCER = 'root-reducer.js';
const ROOT_SAGA = 'root-saga.js';
const REDUX_PATH = 'src/redux';

export default class ModuleGenerator extends Generator {
  config = {
    init: {
      description: 'Create root reducer and root saga'
    },
    addActionsTo: {
      args: 'moduleName ...actions?',
      description: 'Create or modify module with new actions'
    },
    addSagasTo: {
      args: 'moduleName ...sagas',
      description: 'Add saga side effects'
    }
  };

  get rootReducer() {
    const template = this.template(ROOT_REDUCER);
    const path = `${REDUX_PATH}/${template.filename}`;

    return new File(path);
  }

  get rootSaga() {
    const template = this.template(ROOT_SAGA);
    const path = `${REDUX_PATH}/${template.filename}`;

    return new File(path);
  }

  get moduleName() {
    return this.args.moduleName || null;
  }

  get actions() {
    return this.args.actions || [];
  }

  get sagas() {
    return this.args.sagas || [];
  }

  get projectName() {
    const file = new File('package.json')
    return JSON.parse(file.text)['name']
  }

  // search for rootReducer and rootSaga, create if not found
  init() {
    const rootReducer = this.rootReducer;
    const rootSaga = this.rootSaga;

    if (rootReducer.exists) {
      log.warn(`Found a root reducer! Please check the ${rootReducer.path} file.`);
    } else {
      this.template(ROOT_REDUCER).saveAs(rootReducer.path);
    };

    if (rootSaga.exists) {
      log.warn(`Found a root saga! Please check the ${rootSaga.path} file.`);
    } else {
      this.template(ROOT_SAGA).saveAs(rootSaga.path);
    };
  }

  // add action type, action creator, reducer case
  addActionsTo() {
    const rootReducer = this.rootReducer;

    if (!rootReducer.exists) {
      this.init();
    };

    if (!this.actions.length) {
      log.error('Module already initialized. Did you want to add some actions?')
    } else {
      this.addActionsToModule();
    };
  }

  // add saga and watcher
  addSagasTo() {
    const rootSaga = this.rootSaga;

    if (!rootSaga.exists) {
      this.init();
    };

    this.addSagasToModule();
  }

  // async for inquirer
  async addActionsToModule() {
    const template = this.template('_*');
    const path = `${REDUX_PATH}/modules/${template.filename}`;
    let file = new File(path, this.args.moduleName);

    // use existing file or create file from template
    if(!file.exists) {
      file = template;
      this.addModuleToRootReducer();
      this.initSaga(file);
    };

    // add action to file (and corresponding success/failure, if applicable)
    for (const action of this.actions) {
      const response = await inquirer.prompt([
        {
          name: 'addSuccessAndFailure',
          message: `Add success and failure actions for ${casex(action, 'NA_ME')}?`,
          type: 'confirm',
          default: false
        },
      ]);

      this.addActionToFile(action, file);

      if (response.addSuccessAndFailure) {
        this.addActionToFile(`${action}_success`, file, false);
        this.addActionToFile(`${action}_failure`, file, false);
      };
    };

    file.saveAs(path, this.args.moduleName);
  }

  addSagasToModule() {
    const template = this.template('_*');
    const path = `${REDUX_PATH}/modules/${template.filename}`;
    let file = new File(path, this.args.moduleName);

    for (const saga of this.sagas) {
      this.addSagaToFile(saga, file);
    };
  }

  addActionToFile(action, file, shouldAddActionCreator = true) {
    const namedAction = casex(action, 'NA_ME');

    try {
      file.search(namedAction);
      log.warn(`Action ${namedAction} already exists!`);
    } catch (error) {
      log.success(`Adding action: ${namedAction}...`);

      const actionLine = file.search('// Reducer') - 1;
      file.before(
        actionLine,
        `export const __NA_ME__ = '${this.projectName}/${this.moduleName}/__NA_ME__'`,
        action
      );
    };

    try {
      file.search(`case ${namedAction}:`);
      log.warn(`Action ${namedAction} already in reducer!`);
    } catch (error) {
      file.before(
        'default: return state',
        [
          '    case __NA_ME__:',
          '      // Perform action',
          '      return state',
          ''
        ],
        action
      );
    };

    if (shouldAddActionCreator) {
      const namedActionCreator = casex(action, 'naMe');

      try {
        file.search(`export function ${namedActionCreator}() {`);
        log.warn(`Action creator ${namedActionCreator} already exists!`);
      } catch (error) {
        file.before(
          '// Sagas',
          [
            namedCasex('export function __naMe__() {', + `${action}_${this.args.moduleName}`),
            '  return {',
            '    type: __NA_ME__',
            '  }',
            '}',
            ''
          ],
          action
        );
      };
    };
  }

  addSagaToFile(saga, file) {
    const namedSaga = casex(saga, 'naMe') + 'Saga';
    const namedWatcher = 'watch' + casex(saga, 'NaMe') + 'Saga';
    let shouldSave = false;

    try {
      file.search(`function* ${namedSaga}()`);
      log.warn(`Saga ${namedSaga} already exists!`);
    } catch (error) {
      log.success(`Adding saga: ${namedSaga}`);
      file.after(
        '// Effects',
        [
          '  function* __naMe__Saga() {',
          '    // perform side effects',
          '  }',
          ''
        ],
        saga
      );

      shouldSave = true;
    };

    try {
      file.search(`function* ${namedWatcher}()`);
      log.warn(`Watcher ${namedWatcher} already exists!`);
    } catch (error) {
      file.after(
        '// Watchers',
        [
          '  function* watch__NaMe__Saga() {',
          '    // yield take(pattern, __naMe__Saga)',
          '  }',
          ''
        ],
        saga
      );

      shouldSave = true;
    };

    try {
      file.search(`${namedWatcher},`);
      log.warn(`Watcher ${namedWatcher} is already exported!`);
    } catch (error) {
      file.afterLast(
        '  return {',
        '    watch__NaMe__Saga,',
        saga
      );

      shouldSave = true;
    };

    // only save if a change has been made
    if (shouldSave) {
      file.save();
    };

    const rootSaga = this.rootSaga;

    try {
      rootSaga.search(namedWatcher);
      log.warn(`Watcher ${namedWatcher} already yielded by root saga!`);
    } catch (error) {
      rootSaga
        .before(
          `} = create${casex(this.moduleName, 'NaMe')}Saga()`,
          '    watch__NaMe__Saga,',
          saga
        )
        .after(
          `} = create${casex(this.moduleName, 'NaMe')}Saga()`,
          '  yield spawn(watch__NaMe__Saga)',
          saga
        )
        .save();
    };
  }

  addModuleToRootReducer() {
    const file = this.rootReducer;
    const namedModule = casex(this.moduleName, 'naMe');

    try {
      file.search(`import ${namedModule}`);
      log.warn(`Reducer ${namedModule} already combined by root reducer!`);
    } catch (error) {
      file
        .afterLast('import ', "import __naMe__ from './modules/__naMe__'", this.moduleName)
        .after('combineReducers({', '  __naMe__,', this.moduleName)
        .save();
    };
  }

  // init saga for new module and add to root saga
  initSaga(file) {
    const namedSaga = 'create' + casex(this.moduleName, 'NaMe') + 'Saga';

    try {
      file.search(namedSaga);
      log.warn(`Saga ${namedSaga} already exists!`);
    } catch (error) {
      file.after(
        '// Sagas',
        [
          namedCasex('export function create__NaMe__Saga() {', this.moduleName),
          '  // Effects',
          '  // Watchers',
          '  return {',
          '  }',
          '}'
        ]
      );
    };

    const rootSaga = this.rootSaga;

    try {
      file.search(`} = ${namedSaga}()`);
      log.warn(`Saga ${namedSaga} already invoked by root saga!`);
    } catch (error) {
      rootSaga
        .after(
          "} from 'redux-saga/effects'",
          "import { create__NaMe__Saga } from './modules/__na-me__'",
          this.moduleName
        )
        .after(
          'function* rootSaga() {',
          [
            '  const {',
            '  } = create__NaMe__Saga()',
            ''
          ],
          this.moduleName
        )
        .save();
    };
  }
}
