import { TypeReference } from "@fern-fern/ir-model/types";
import { TypeReferenceNode } from "@fern-typescript/commons";
import { ts } from "ts-morph";
import { AbstractTypeReferenceToTypeNodeConverter } from "./AbstractTypeReferenceToTypeNodeConverter";

export declare namespace TypeReferenceToParsedTypeNodeConverter {
    export interface Init extends AbstractTypeReferenceToTypeNodeConverter.Init {
        includeSerdeLayer: boolean;
    }
}

export class TypeReferenceToParsedTypeNodeConverter extends AbstractTypeReferenceToTypeNodeConverter {
    private includeSerdeLayer: boolean;

    constructor({ includeSerdeLayer, ...superInit }: TypeReferenceToParsedTypeNodeConverter.Init) {
        super({ ...superInit });
        this.includeSerdeLayer = includeSerdeLayer;
    }

    protected override set(itemType: TypeReference): TypeReferenceNode {
        if (this.includeSerdeLayer && this.isTypeReferencePrimitive(itemType)) {
            const itemTypeNode = this.convert(itemType).typeNode;
            return this.generateNonOptionalTypeReferenceNode(ts.factory.createTypeReferenceNode("Set", [itemTypeNode]));
        } else {
            return this.list(itemType);
        }
    }

    protected override dateTime(): TypeReferenceNode {
        return this.includeSerdeLayer
            ? this.generateNonOptionalTypeReferenceNode(ts.factory.createTypeReferenceNode("Date"))
            : this.string();
    }
}
