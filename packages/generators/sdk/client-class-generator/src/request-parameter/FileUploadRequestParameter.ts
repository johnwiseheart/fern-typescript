import { HttpHeader, InlinedRequestBodyProperty, QueryParameter } from "@fern-fern/ir-model/http";
import { GeneratedRequestWrapper, SdkContext } from "@fern-typescript/contexts";
import { ts } from "ts-morph";
import { AbstractRequestParameter } from "./AbstractRequestParameter";

export class FileUploadRequestParameter extends AbstractRequestParameter {
    protected getParameterType(context: SdkContext): {
        type: ts.TypeNode;
        hasQuestionToken: boolean;
        initializer?: ts.Expression;
    } {
        return {
            type: context.requestWrapper.getReferenceToRequestWrapper(this.packageId, this.endpoint.name),
            hasQuestionToken: false,
        };
    }

    public getInitialStatements(): ts.Statement[] {
        return [];
    }

    public getReferenceToRequestBody(): ts.Expression | undefined {
        throw new Error("Cannot get reference to request body in file upload request");
    }

    public getAllQueryParameters(context: SdkContext): QueryParameter[] {
        return this.getGeneratedRequestWrapper(context).getAllQueryParameters();
    }

    public withQueryParameter(
        queryParameter: QueryParameter,
        context: SdkContext,
        callback: (value: ts.Expression) => ts.Statement[]
    ): ts.Statement[] {
        const generatedRequestWrapper = this.getGeneratedRequestWrapper(context);
        return generatedRequestWrapper.withQueryParameter({
            queryParameter,
            referenceToQueryParameterProperty: this.getReferenceToProperty(
                generatedRequestWrapper.getPropertyNameOfQueryParameter(queryParameter).propertyName
            ),
            context,
            callback,
        });
    }

    public getReferenceToQueryParameter(queryParameterKey: string, context: SdkContext): ts.Expression {
        const queryParameter = this.endpoint.queryParameters.find(
            (queryParam) => queryParam.name.wireValue === queryParameterKey
        );
        if (queryParameter == null) {
            throw new Error("Query parameter does not exist: " + queryParameterKey);
        }
        const generatedRequestWrapper = this.getGeneratedRequestWrapper(context);
        return this.getReferenceToProperty(
            generatedRequestWrapper.getPropertyNameOfQueryParameter(queryParameter).propertyName
        );
    }

    public getReferenceToNonLiteralHeader(header: HttpHeader, context: SdkContext): ts.Expression {
        return this.getReferenceToProperty(
            this.getGeneratedRequestWrapper(context).getPropertyNameOfNonLiteralHeader(header).propertyName
        );
    }

    public getReferenceToBodyProperty(property: InlinedRequestBodyProperty, context: SdkContext): ts.Expression {
        return this.getReferenceToProperty(
            this.getGeneratedRequestWrapper(context).getInlinedRequestBodyPropertyKey(property)
        );
    }

    private getGeneratedRequestWrapper(context: SdkContext): GeneratedRequestWrapper {
        return context.requestWrapper.getGeneratedRequestWrapper(this.packageId, this.endpoint.name);
    }

    private getReferenceToProperty(propertyName: string): ts.Expression {
        return ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier(this.getRequestParameterName()),
            propertyName
        );
    }
}
