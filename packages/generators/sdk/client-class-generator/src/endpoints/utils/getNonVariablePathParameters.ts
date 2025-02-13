import { PathParameter } from "@fern-fern/ir-model/http";

export function getNonVariablePathParameters(pathParameters: PathParameter[]): PathParameter[] {
    return pathParameters.filter((pathParameter) => pathParameter.variable == null);
}
