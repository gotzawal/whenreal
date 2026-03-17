export class TileSet {
    public asset: { generatetool: string, version: string, gltfUpAxis?: string };
    public extras: { scenetree: string };
    public geometricError: number
    public properties: Record<string, unknown>;
    public refine: string;
    public root: TileSetRoot;
}

export class TileSetRoot {
    public boundingVolume: { box: number[] };
    public children: TileSetChild[];
    public geometricError: number;
    public transform: number[];
}

export class TileSetChild {
    public boundingVolume: { box: number[] };
    public geometricError: number;
    public refine: string;
    public content: { uri: string };
    public contents: TileSetChildContent[]
}

export class TileSetChildContent {
    public uri: string;
    public group: number;
    public metadata: TileSetChildContentMetaData;
}

export class TileSetChildContentMetaData {
    public class: string;
    public properties: { vertices: number, materials: number }
}
