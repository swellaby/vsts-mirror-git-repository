import * as taskLib from "azure-pipelines-task-lib";
import * as validUrl from "valid-url";
import { readFile, writeFileSync } from "fs";
import { resolve as resolvePath, join as joinPath } from "path";

export class GitMirrorTask {
    private sourceGitRepositoryUri: string;
    private sourceGitRepositoryPersonalAccessToken: string;
    private sourceVerifySSLCertificate: boolean;
    private destinationGitRepositoryUri: string;
    private destinationGitRepositoryPersonalAccessToken: string;
    private destinationVerifySSLCertificate: boolean;

    public constructor() {
        try {
            if (this.taskIsRunning()) {
                // this.sourceGitRepositoryUri = taskLib.getInput("sourceGitRepositoryUri", true);
                // this.sourceGitRepositoryPersonalAccessToken = taskLib.getInput("sourceGitRepositoryPersonalAccessToken", false);
                // this.sourceVerifySSLCertificate = taskLib.getBoolInput("sourceVerifySSLCertificate", false);
                // this.destinationGitRepositoryUri = taskLib.getInput("destinationGitRepositoryUri", true);
                // this.destinationGitRepositoryPersonalAccessToken = taskLib.getInput("destinationGitRepositoryPersonalAccessToken", true);
                // this.destinationVerifySSLCertificate = taskLib.getBoolInput("destinationVerifySSLCertificate", false);
                this.sourceGitRepositoryUri = "https://github.com/Jamesits/some-private-repo";
                this.sourceGitRepositoryPersonalAccessToken = null;
                this.sourceVerifySSLCertificate = false;
                this.destinationGitRepositoryUri = "somewhere";
                this.destinationGitRepositoryPersonalAccessToken = null;
                this.destinationVerifySSLCertificate = false;
            }
        } catch (e) {
            taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }

    public async run() {
        if (this.taskIsRunning()) {
            console.log("****************");
            console.log("inside run check");
            try {
                // check if git exists as a tool
                taskLib.which("git", true);
                const cloneMirrorResponseCode = await this.gitCloneMirror();
                console.log(`mirror response code: ${cloneMirrorResponseCode}`);
                if (cloneMirrorResponseCode !== 0) {
                    taskLib.setResult(taskLib.TaskResult.Failed, "An error occurred when attempting to clone the source repository. Please check output for more details.");
                    return;
                }

                await this.removePullRequestRefs();
                
                const pushMirrorResponseCode = await this.gitPushMirror();
                if (pushMirrorResponseCode !== 0) {
                    taskLib.setResult(taskLib.TaskResult.Failed, "An error occurred when attempting to push to the destination repository. Please check output for more details.");
                }

            } catch (e) {
                console.log(`down inside run catch block. error: ${e}`);
                taskLib.setResult(taskLib.TaskResult.Failed, e);
            }
        }
    }

    public gitCloneMirror() {
        console.log("about to get source uri");
        const authenticatedSourceGitUrl = this.getAuthenticatedGitUri(this.sourceGitRepositoryUri, this.sourceGitRepositoryPersonalAccessToken);
        console.log(`got source uri: ${authenticatedSourceGitUrl}`);
        const verifySSLCertificateFlag = this.getSourceVerifySSLCertificate();
        return taskLib
            .tool("git")
            .argIf(verifySSLCertificateFlag, ["-c", "http.sslVerify=true"])
            .argIf(!verifySSLCertificateFlag, ["-c", "http.sslVerify=false"])
            .arg("clone")
            .arg("--mirror")
            .arg(authenticatedSourceGitUrl)
            .exec();
    }

    public async removePullRequestRefs(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
                const sourceGitFolder = this.getSourceGitFolder(this.sourceGitRepositoryUri);
                const packedRefsFileName = resolvePath(joinPath(".", `${sourceGitFolder}/packed-refs`));
                readFile(packedRefsFileName, "utf8", (err, data) => {
                    if (err) {
                        reject(err);
                    }

                    const nonPullRefLines = data.split("\n").filter((line) => !line.includes("refs/pull"));
                    writeFileSync(packedRefsFileName, nonPullRefLines.join("\n"));
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    public gitPushMirror() {
        const sourceGitFolder = this.getSourceGitFolder(this.sourceGitRepositoryUri);
        const authenticatedDestinationGitUrl = this.getAuthenticatedGitUri(this.destinationGitRepositoryUri, this.destinationGitRepositoryPersonalAccessToken);
        const verifySSLCertificateFlag = this.getDestinationVerifySSLCertificate();

        return taskLib
            .tool("git")
            .argIf(verifySSLCertificateFlag, ["-c", "http.sslVerify=true"])
            .argIf(!verifySSLCertificateFlag, ["-c", "http.sslVerify=false"])
            .arg("-C")
            .arg(sourceGitFolder)
            .arg("push")
            .arg("--mirror")
            .arg(authenticatedDestinationGitUrl)
            .exec();
    }

    public getSourceVerifySSLCertificate(): boolean {
        return this.sourceVerifySSLCertificate;
    }

    public getDestinationVerifySSLCertificate(): boolean {
        return this.destinationVerifySSLCertificate;
    }

    public getSourceGitFolder(uri: string): string {
        if (!validUrl.isUri(uri)) {
            throw new Error(`Provided URI '${uri}' is not a valid URI`);
        }

        const gitIdentifier = ".git";

        if (uri.substring(uri.length - gitIdentifier.length) === gitIdentifier) {
            return uri.substring(uri.lastIndexOf("/") + 1);
        }

        return uri.substring(uri.lastIndexOf("/") + 1) + gitIdentifier;
    }

    public getAuthenticatedGitUri(uri: string, token: string): string {
        if (!validUrl.isUri(uri)) {
            throw new Error("Provided URI '" + uri + "' is not a valid URI");
        }
        else if (token === undefined) {
            return uri;
        }
        else {
            const colonSlashSlash = "://";
            const protocol = uri.substring(0, uri.indexOf(colonSlashSlash));
            const address = uri.substring(uri.indexOf(colonSlashSlash) + colonSlashSlash.length);
            return protocol + colonSlashSlash + token + "@" + address;
        }    
    }

    private taskIsRunning(): number {
        return 1;
        // return taskLib.getVariables().length;
    }
}

const gitMirrorTask = new GitMirrorTask();
console.log("about to run");
gitMirrorTask.run();
