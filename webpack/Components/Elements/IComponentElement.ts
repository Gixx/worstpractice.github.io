/**
 * A component element exposing an id and an underlying HTML element.
 * The concrete HTML element type can be specified (e.g. HTMLDivElement).
 */
export interface IComponentElement<T extends HTMLElement = HTMLElement> {
    getId(): string;
    getName(): string;
    getHTMLElement(): T;
}

/** Convenience alias for a component element whose underlying element is HTMLElement */
export type IBaseComponentElement = IComponentElement<HTMLElement>;
