import { AnimationCurve } from "../../../math/AnimationCurve";

/**
 * @internal
 * @group Animation
 */
export class AttributeAnimCurve extends AnimationCurve {
    public attribute: string = '';
    public propertyList: string[];
    public path: string;

    constructor() {
        super();
    }

    public unSerialized(data: Record<string, unknown>): this {
        this.attribute = data.attribute as string;
        this.path = data.path as string;
        this.propertyList = this.attribute.split('.');
        super.unSerialized(data.curve as Record<string, unknown>);
        return this;
    }
}
