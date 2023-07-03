import { RelativeFilePath } from "@fern-api/fs-utils";
import { ts } from "ts-morph";
import { DependencyManager } from "../../dependency-manager/DependencyManager";
import { CoreUtility } from "../CoreUtility";
import { StreamingFetcher } from "./StreamingFetcher";

export class StreamingFetcherImpl extends CoreUtility implements StreamingFetcher {
    public readonly MANIFEST = {
        name: "streaming-fetcher",
        repoInfoForTesting: {
            path: RelativeFilePath.of("packages/core-utilities/streaming-fetcher/src"),
        },
        originalPathOnDocker: "/assets/streaming-fetcher" as const,
        pathInCoreUtilities: [{ nameOnDisk: "streaming-fetcher", exportDeclaration: { exportAll: true } }],
        addDependencies: (dependencyManager: DependencyManager): void => {
            dependencyManager.addDependency("axios", "1.4.0");
            dependencyManager.addDependency("@ungap/url-search-params", "0.2.2");
        },
    };

    public readonly StreamingFetcher: StreamingFetcher["StreamingFetcher"] = {
        Args: {
            properties: {
                url: "url",
                method: "method",
                headers: "headers",
                queryParameters: "queryParameters",
                body: "body",
                timeoutMs: "timeoutMs",
                withCredentials: "withCredentials",
                onUploadProgress: "onUploadProgress",
                onDownloadProgress: "onDownloadProgress",
                onData: "onData",
                onError: "onError",
                onFinish: "onFinish",
                abortController: "abortController",
                terminator: "terminator",
                adapter: "adapter",
                responseChunkPrefix: "responseChunkPrefix",
            },
            _getReferenceToType: this.getReferenceToTypeInStreamingFetcherModule("Args"),
        },

        Response: {
            properties: {
                data: "data",
                headers: "headers",
            },
            _getReferenceToType: this.getReferenceToTypeInStreamingFetcherModule("Response"),
        },
    };

    public readonly StreamingFetchFunction = {
        _getReferenceToType: this.withExportedName(
            "StreamingFetchFunction",
            (StreamingFetcher) => () => StreamingFetcher.getTypeNode()
        ),
    };

    public readonly streamingFetcher = {
        _getReferenceTo: this.withExportedName(
            "streamingFetcher",
            (streamingFetcher) => () => streamingFetcher.getExpression()
        ),
        _invoke: (
            args: StreamingFetcher.Args,
            { referenceToFetcher }: { referenceToFetcher: ts.Expression }
        ): ts.Expression => {
            const properties: ts.PropertyAssignment[] = [
                ts.factory.createPropertyAssignment(this.StreamingFetcher.Args.properties.url, args.url),
                ts.factory.createPropertyAssignment(this.StreamingFetcher.Args.properties.method, args.method),
            ];
            if (args.headers.length > 0) {
                properties.push(
                    ts.factory.createPropertyAssignment(
                        this.StreamingFetcher.Args.properties.headers,
                        ts.factory.createObjectLiteralExpression(args.headers, true)
                    )
                );
            }
            if (args.queryParameters != null) {
                properties.push(
                    ts.factory.createPropertyAssignment(
                        this.StreamingFetcher.Args.properties.queryParameters,
                        args.queryParameters
                    )
                );
            }
            if (args.body != null) {
                properties.push(
                    ts.factory.createPropertyAssignment(this.StreamingFetcher.Args.properties.body, args.body)
                );
            }
            properties.push(
                ts.factory.createPropertyAssignment(
                    this.StreamingFetcher.Args.properties.timeoutMs,
                    args.timeoutInSeconds
                )
            );
            if (args.withCredentials) {
                properties.push(
                    ts.factory.createPropertyAssignment(
                        this.StreamingFetcher.Args.properties.withCredentials,
                        ts.factory.createTrue()
                    )
                );
            }
            if (args.onUploadProgress != null) {
                properties.push(
                    ts.factory.createPropertyAssignment(
                        this.StreamingFetcher.Args.properties.onUploadProgress,
                        args.onUploadProgress
                    )
                );
            }
            if (args.onData != null) {
                properties.push(
                    ts.factory.createPropertyAssignment(this.StreamingFetcher.Args.properties.onData, args.onData)
                );
            }
            if (args.onError != null) {
                properties.push(
                    ts.factory.createPropertyAssignment(this.StreamingFetcher.Args.properties.onError, args.onError)
                );
            }
            if (args.onFinish != null) {
                properties.push(
                    ts.factory.createPropertyAssignment(this.StreamingFetcher.Args.properties.onFinish, args.onFinish)
                );
            }
            if (args.abortController != null) {
                properties.push(
                    ts.factory.createPropertyAssignment(
                        this.StreamingFetcher.Args.properties.abortController,
                        args.abortController
                    )
                );
            }
            if (args.terminator != null) {
                properties.push(
                    ts.factory.createPropertyAssignment(
                        this.StreamingFetcher.Args.properties.terminator,
                        args.terminator
                    )
                );
            }

            return ts.factory.createAwaitExpression(
                ts.factory.createCallExpression(referenceToFetcher, undefined, [
                    ts.factory.createObjectLiteralExpression(properties, true),
                ])
            );
        },
    };

    public getHeader = {
        _invoke: this.withExportedName(
            "getHeader",
            (getHeader) =>
                ({ referenceToRequest, header }: { referenceToRequest: ts.Expression; header: string }) =>
                    ts.factory.createCallExpression(getHeader.getExpression(), undefined, [
                        referenceToRequest,
                        ts.factory.createStringLiteral(header),
                    ])
        ),
    };

    private getReferenceToTypeInStreamingFetcherModule(typeName: string) {
        return this.withExportedName(
            "StreamingFetcher",
            (Fetcher) => () =>
                ts.factory.createTypeReferenceNode(ts.factory.createQualifiedName(Fetcher.getEntityName(), typeName))
        );
    }
}
