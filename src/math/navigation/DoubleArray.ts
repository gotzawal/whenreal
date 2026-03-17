export class DoubleArray<K = unknown, V = unknown> {

    private _keys: Array<K> = new Array<K>();

    private _values: Array<V> = new Array<V>();

    public getIndexByKey(key: K): number {
        return this._keys.indexOf(key);
    }

    public getValueByKey(key: K): V {
        var index: number = this.getIndexByKey(key);
        if (index > -1) {
            return this._values[index];
        }
        return null;
    }

    public put(key: K, value: V): V {
        if (key == null)
            return null;
        var old: V = this.remove(key);
        this._keys.push(key);
        this._values.push(value);
        return old;
    }

    public remove(key: K): V {
        var index: number = this._keys.indexOf(key)
        var item: V;
        if (index > -1) {
            item = this._values[index];
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
        }
        return item;
    }

    public getValues(): Array<V> {
        return this._values;
    }

    public getKeys(): Array<K> {
        return this._keys;
    }

    public clear(): void {
        this._values.length = 0;
        this._keys.length = 0;
    }

}
