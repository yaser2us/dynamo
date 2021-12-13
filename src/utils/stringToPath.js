import compact from './compact';

export default (input) =>
  compact(input.replace(/["|']|\]/g, '').split(/\.|\[/));
