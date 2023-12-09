export enum ColType {
    Int,
    String
}

export class Attribute {
    length: number | undefined;
    notNull: boolean | undefined;
    primary: boolean | undefined;
    type: ColType;
    constructor(ty: ColType) {
        this.type = ty;
    }

    isPrimary(): Attribute {
        this.primary = true;
        return this;
    }

    isNotNull(): Attribute {
        this.notNull = true;
        return this;
    }

    maxLength(length: number): Attribute {
        this.length = length;
        return this;
    }
}

export interface Structure {
    [column: string]: Attribute
}


export default class Blueprint {
    structure: Structure;

    constructor() {
        this.structure = {};
    }

    id() {
        this.structure["id"] = new Attribute(ColType.Int).isNotNull().isPrimary();
        return this.structure["id"];
    }

    string(colName: string) {
        this.structure[colName] = new Attribute(ColType.String);
        return this.structure[colName];
    }
}