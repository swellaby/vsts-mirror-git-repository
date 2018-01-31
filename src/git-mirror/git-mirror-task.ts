import * as taskLib from "vsts-task-lib";

export class GitMirrorTask {
    private destinationGitRepositoryUri: string;
    private gitMirrorPersonalAccessToken: string;
    private sourceGitRepositoryUri: string;

    public constructor() {
        try {
            this.sourceGitRepositoryUri = taskLib.getInput("sourceGitRepositoryUri", true);
            this.destinationGitRepositoryUri = taskLib.getInput("destinationGitRepositoryUri", true);
            this.gitMirrorPersonalAccessToken = taskLib.getInput("gitMirrorPersonalAccessToken", true);
        } catch (e) {
            // taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }

    public run() {
        try {
            // check if git exists as a tool
            taskLib.which("git", true);

            if (this.sourceGitRepositoryUri === undefined) {
                throw new Error("Source Git Repository cannot be undefined");
            } else if (this.destinationGitRepositoryUri === undefined) {
                throw new Error("Destination Git Repository cannot be undefined");
            } else if (this.gitMirrorPersonalAccessToken === undefined) {
                throw new Error("Personal Access Token cannot be undefined");
            }

            this.gitCloneMirror();
            this.gitPushMirror();
        } catch (e) {
            // taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }

    private gitCloneMirror() {
        taskLib
            .tool("git")
            .arg("clone")
            .arg("--mirror")
            .arg(this.sourceGitRepositoryUri)
            .exec();
    }

    private gitPushMirror() {
        taskLib
            .tool("git")
            .arg("-C")
            .arg(this.getSourceGitFolder(this.sourceGitRepositoryUri))
            .arg("push")
            .arg("--mirror")
            .arg(this.getAuthenticatedGitUri(this.destinationGitRepositoryUri, this.gitMirrorPersonalAccessToken))
            .exec();
    }

    private getSourceGitFolder(uri: string): string {
        return uri.substring(uri.lastIndexOf("/") + 1) + ".git";
    }

    private getAuthenticatedGitUri(uri: string, token: string): string {
        const colonSlashSlash = "://";
        const protocol = uri.substring(0, uri.indexOf(colonSlashSlash));
        if (protocol === "http" || protocol === "https") {
            const address = uri.substring(uri.indexOf(colonSlashSlash) + colonSlashSlash.length);
            return protocol + colonSlashSlash + token + "@" + address;
        } else {
            return token + "@" + uri;
        }
    }
}

const gitMirrorTask = new GitMirrorTask();
gitMirrorTask.run();
