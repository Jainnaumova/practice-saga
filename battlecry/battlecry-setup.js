export default function setup(battlecry) {
  // Load additional generators here
  // battlecry.load('node_modules/battlecry-generatores-from-node-modules');
  //
  // Define new aliases
  // battlecry.aliases.s = 'strike';
  battlecry.aliases.a = 'addActionsTo';
  battlecry.aliases.s = 'addSagasTo';
  //
  // [ADVANCED] Define specific glob options
  // battlecry.globOptions({ dot: false, nocase: false });
}
