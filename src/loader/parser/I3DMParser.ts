import { Matrix4 } from '../../math/Matrix4';
import { ParserBase } from './ParserBase';
import { ParserFormat } from './ParserFormat';
import { I3DMLoader } from "./i3dm/I3DMLoader";

export class I3DMParser extends ParserBase {
    static format: ParserFormat = ParserFormat.BIN;
    async parseBuffer(buffer: ArrayBuffer) {
        let loader = new I3DMLoader();
        loader.adjustmentTransform = this.userData as Matrix4;
        this.data = await loader.parse(buffer);
    }

    /**
     * Verify parsing validity
     * @param ret
     * @returns
     */
    public verification(): boolean {
        if (this.data) {
            return true;
        }
        throw new Error('Method not implemented.');
    }
}