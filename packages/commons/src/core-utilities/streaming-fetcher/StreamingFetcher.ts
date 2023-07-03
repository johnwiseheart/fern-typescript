import { StreamingFetcher as ActualStreamingFetcher } from "@fern-typescript/streaming-fetcher";
import { ts } from "ts-morph";

export interface StreamingFetcher {
    readonly StreamingFetcher: {
        Args: {
            properties: { [Arg in keyof ActualStreamingFetcher.Args]-?: Arg };
            _getReferenceToType: () => ts.TypeNode;
        };

        Response: {
            properties: { [Key in keyof ActualStreamingFetcher.Response]-?: Key };
            _getReferenceToType: () => ts.TypeNode;
        };
    };

    readonly streamingFetcher: {
        _getReferenceTo: () => ts.Expression;
        _invoke: (
            args: StreamingFetcher.Args,
            opts: {
                referenceToFetcher: ts.Expression;
            }
        ) => ts.Expression;
    };

    readonly StreamingFetchFunction: {
        _getReferenceToType: () => ts.TypeNode;
    };

    readonly getHeader: {
        _invoke: (args: { referenceToRequest: ts.Expression; header: string }) => ts.Expression;
    };
}

export declare namespace StreamingFetcher {
    export interface Args {
        url: ts.Expression;
        method: ts.Expression;
        headers: ts.ObjectLiteralElementLike[];
        queryParameters: ts.Expression | undefined;
        body: ts.Expression | undefined;
        timeoutInSeconds: ts.Expression;
        withCredentials: boolean;
        onUploadProgress: ts.Expression | undefined;

        onData: ts.Expression | undefined;
        onError: ts.Expression | undefined;
        onFinish: ts.Expression | undefined;
        abortController: ts.Expression | undefined;
        terminator: ts.Expression | undefined;
    }
}
