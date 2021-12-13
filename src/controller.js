import { useController } from './useController';
const Controller = (props) => props.render(useController(props));
export { Controller };