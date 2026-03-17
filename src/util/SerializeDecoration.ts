
export type SerializeTag = null | 'self' | 'non';

export function NonSerialize(cls: object, key: string) {
    let dic = cls['__NonSerialize__'];
    if (!dic) {
        dic = cls['__NonSerialize__'] = {};
        dic['__NonSerialize__'] = true;
    }

    dic[key] = true;
}

export function IsNonSerialize<T extends object>(instance: T, key: string): boolean {
    let noSerializeDic;
    while (instance) {
        instance = instance['__proto__'];
        if (instance) noSerializeDic = instance['__NonSerialize__'];
        if (noSerializeDic) break;
    }
    return noSerializeDic && noSerializeDic[key];
}


export function EditorInspector(cls: object, key: string, p1?: unknown, p2?: unknown, p3?: unknown) {
    let dic: Map<string, Map<string, unknown>> = cls['__EditorInspector__'];
    if (!dic) {
        dic = cls['__EditorInspector__'] = new Map<string, Map<string, unknown>>();
    }
    let property = dic.get(cls.constructor.name);
    if (!property) {
        property = new Map<string, unknown>();
        dic.set(cls.constructor.name, property);
    }
    property.set(key, { p1, p2, p3 });
}

export function IsEditorInspector<T extends object>(instance: T): Map<string, unknown> {
    let propertyDic: Map<string, Map<string, unknown>>;
    let ins = instance;
    let list = []
    while (ins) {
        if (list.indexOf(ins.constructor.name) != -1) {
            ins = ins['__proto__'];
            continue;
        }
        list.push(ins.constructor.name);
        ins = ins['__proto__'];
    }
    list = list.reverse();

    ins = instance
    while (ins) {
        ins = ins['__proto__'];
        if (ins) {
            propertyDic = ins['__EditorInspector__'];
        }
        if (propertyDic) break;
    }

    let final = new Map<string, unknown>();
    if (propertyDic) {
        for (let i = 0; i < list.length; i++) {
            const c_name = list[i];
            let dic = propertyDic.get(c_name);
            if (dic) {
                dic.forEach((v, k) => {
                    final.set(k, v);
                });
            }
        }
    }
    return final;
}







// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RegisterComponent(cls: unknown, key: string, p1?: unknown, p2?: unknown, p3?: unknown): any {
    let dic: { [name: string]: unknown } = window['__Component__'];
    if (!dic) {
        dic = window['__Component__'] = {};
    }
    dic[key] = cls;
}

export function GetComponentClass(name: string) {
    let coms = window['__Component__'];
    if (coms[name]) {
        return coms[name];
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RegisterShader(cls: Function, key?: string, p1?: unknown, p2?: unknown, p3?: unknown): any {
    let dic: { [name: string]: unknown } = window['__shader__'];
    if (!dic) {
        dic = window['__shader__'] = {};
    }
    dic[key ?? cls.name] = cls;
}

export function GetShader(name: string) {
    let coms = window['__shader__'];
    if (coms[name]) {
        return coms[name];
    }
    return null;
}