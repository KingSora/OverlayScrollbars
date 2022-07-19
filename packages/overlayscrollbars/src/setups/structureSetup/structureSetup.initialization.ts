import type {
  InitializationTargetElement,
  StaticInitializationElement,
  DynamicInitializationElement,
  DefaultInitializtationElement,
} from 'initialization';

export type StructureStaticInitializationElement = StaticInitializationElement<
  [target: InitializationTargetElement]
>;

export type StructureDynamicInitializationElement = DynamicInitializationElement<
  [target: InitializationTargetElement]
>;

/**
 * Object for special initialization.
 *
 * Target is always required, if element is not provided or undefined it will be generated.
 *
 * If element is provided, the provided element takes all its responsibilities.
 * DOM hierarchy isn't checked in this case, its assumed that hieararchy is correct in such a case.
 *
 * Null or Undefined means that the environment initialization strategy is used.
 */
export interface StructureInitialization {
  target: InitializationTargetElement;
  host?: StructureStaticInitializationElement; // only relevant for textarea
  viewport?: StructureStaticInitializationElement;
  padding?: StructureDynamicInitializationElement;
  content?: StructureDynamicInitializationElement;
}

export type DefaultStructureInitialization = {
  [K in keyof Omit<StructureInitialization, 'target'>]: DefaultInitializtationElement<
    StructureInitialization[K]
  >;
};
