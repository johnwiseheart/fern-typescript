import { getTextOfTsNode } from "@fern-typescript/commons";
import { OptionalKind, ParameterDeclarationStructure, ts } from "ts-morph";

const REQUEST_OPTIONS_PARAMETER_NAME = "_requestOptions";

export const getRequestOptionsParameter = ({
    requestOptionsReference,
}: {
    requestOptionsReference: ts.TypeReferenceNode;
}): OptionalKind<ParameterDeclarationStructure> => {
    return {
        name: REQUEST_OPTIONS_PARAMETER_NAME,
        type: getTextOfTsNode(requestOptionsReference),
        hasQuestionToken: true,
    };
};

export const getTimeoutExpression = ({
    timeoutInSeconds,
    property,
}: {
    timeoutInSeconds: number | "infinity" | undefined;
    property: ts.Identifier;
}): ts.Expression => {
    return ts.factory.createConditionalExpression(
        ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessChain(
                ts.factory.createIdentifier(REQUEST_OPTIONS_PARAMETER_NAME),
                ts.factory.createToken(ts.SyntaxKind.QuestionDotToken),
                property
            ),
            ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
            ts.factory.createIdentifier("null")
        ),
        ts.factory.createToken(ts.SyntaxKind.QuestionToken),
        ts.factory.createParenthesizedExpression(
            ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(REQUEST_OPTIONS_PARAMETER_NAME),
                    property
                ),
                ts.factory.createToken(ts.SyntaxKind.AsteriskToken),
                ts.factory.createNumericLiteral("1000")
            )
        ),
        ts.factory.createToken(ts.SyntaxKind.ColonToken),
        // If timeoutInSeconds is set to infinity, fall back to undefined if requestOptions.timeoutInSeconds is not set
        timeoutInSeconds !== "infinity"
            ? ts.factory.createNumericLiteral(timeoutInSeconds != null ? timeoutInSeconds * 1000 : 60000)
            : ts.factory.createIdentifier("undefined")
    );
};
