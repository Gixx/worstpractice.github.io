import { IComponentElement } from './IComponentElement';
export { ElementsOf, ElementOf } from './IComponentElements';

/**
 * Generic component interface. The element type returned by getElements can
 * be specified; by default it uses `IComponentElement<HTMLElement>`.
 */
export interface IComponent<TElement extends IComponentElement = IComponentElement> {
    getElements(): TElement[];
}
