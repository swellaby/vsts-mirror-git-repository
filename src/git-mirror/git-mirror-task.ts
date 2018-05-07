import * as taskLib from "vsts-task-lib";
import * as validUrl from "valid-url";

export class GitMirrorTask {
    private sourceGitRepositoryUri: string;
    private sourceGitRepositoryPersonalAccessToken: string;
    private destinationGitRepositoryUri: string;
    private destinationGitRepositoryPersonalAccessToken: string;
    private verifySSLCertificate: boolean;

    public constructor() {
        try {
            if (this.taskIsRunnning()) {
                this.sourceGitRepositoryUri = taskLib.getInput("sourceGitRepositoryUri", true);
                this.sourceGitRepositoryPersonalAccessToken = taskLib.getInput("sourceGitRepositoryPersonalAccessToken", false);
                this.verifySSLCertificate = taskLib.getBoolInput("verifySSLCertificate", false);
                this.destinationGitRepositoryUri = taskLib.getInput("destinationGitRepositoryUri", true);
                this.destinationGitRepositoryPersonalAccessToken = taskLib.getInput("destinationGitRepositoryPersonalAccessToken", true);
            }
        } catch (e) {
            taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }

    public run() {
        if (this.taskIsRunnning()) {

            try {
                // check if git exists as a tool
                taskLib.which("git", true);

                this.gitCloneMirror().then((code) => {
                    if (code !== 0) {
                        taskLib.setResult(taskLib.TaskResult.Failed, "An error occurred when attempting to clone the source repository. Please check output for more details.");
                        return;
                    }
                    this.gitPushMirror().then((code) => {
                        if (code !== 0) {
                            taskLib.setResult(taskLib.TaskResult.Failed, "An error occurred when attempting to push to the destination repository. Please check output for more details.");
                        }
                    }).catch((err) => {
                        taskLib.setResult(taskLib.TaskResult.Failed, err);
                    });
                }).catch((err) => {
                    taskLib.setResult(taskLib.TaskResult.Failed, err);
                });

            } catch (e) {
                taskLib.setResult(taskLib.TaskResult.Failed, e);
            }
        }
    }

    public gitCloneMirror() {
        const authenticatedSourceGitUrl = this.getAuthenticatedGitUri(this.sourceGitRepositoryUri, this.sourceGitRepositoryPersonalAccessToken);
        const verifySSLCertificateFlag = this.getVerifySSLCertificate();

        return taskLib
            .tool("git")
            .argIf(verifySSLCertificateFlag, ["-c", "http.sslVerify=true"])
            .argIf(!verifySSLCertificateFlag, ["-c", "http.sslVerify=false"])
            .arg("clone")
            .arg("--mirror")
            .arg(authenticatedSourceGitUrl)
            .exec();
    }

    public gitPushMirror() {
        const sourceGitFolder = this.getSourceGitFolder(this.sourceGitRepositoryUri);
        const authenticatedDestinationGitUrl = this.getAuthenticatedGitUri(this.destinationGitRepositoryUri, this.destinationGitRepositoryPersonalAccessToken);

        return taskLib
            .tool("git")
            .arg("-C")
            .arg(sourceGitFolder)
            .arg("push")
            .arg("--mirror")
            .arg(authenticatedDestinationGitUrl)
            .exec();
    }

    public getVerifySSLCertificate(): boolean {
        return this.verifySSLCertificate;
    }

    public getSourceGitFolder(uri: string): string {
        if (!validUrl.isUri(uri)) {
            throw new Error("Provided URI '" + uri + "' is not a valid URI");
        }

        const gitIdentifier = ".git";

        if (uri.substring(uri.length - gitIdentifier.length) === gitIdentifier) {
            return uri.substring(uri.lastIndexOf("/") + 1);
        }

        return uri.substring(uri.lastIndexOf("/") + 1) + ".git";
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

    private taskIsRunnning(): number {
        return taskLib.getVariables().length;
    }
}

const gitMirrorTask = new GitMirrorTask();
gitMirrorTask.run();
