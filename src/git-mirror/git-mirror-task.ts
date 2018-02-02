import * as taskLib from "vsts-task-lib";
import * as shell from "shelljs";

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
            const toolPath = taskLib.which("git", true);

            console.log("tool path" + toolPath);

            if (this.sourceGitRepositoryUri === undefined) {
                throw new Error("Source Git Repository cannot be undefined");
            } else if (this.destinationGitRepositoryUri === undefined) {
                throw new Error("Destination Git Repository cannot be undefined");
            } else if (this.gitMirrorPersonalAccessToken === undefined) {
                throw new Error("Personal Access Token cannot be undefined");
            }

            this.gitCloneMirror();
            // this.gitPushMirror();
        } catch (e) {
            // taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }

    private gitCloneMirror() {
        console.log("Attempting to: git clone --mirror " + this.sourceGitRepositoryUri);

        shell.exec("git clone --mirror " + this.sourceGitRepositoryUri);

        console.log("clone finished");
        // taskLib
        //     .tool("git")
        //     .arg("clone")
        //     .arg("--mirror")
        //     .arg(this.sourceGitRepositoryUri)
        //     .exec();
    }

    private gitPushMirror() {
        const sourceGitFolder = this.getSourceGitFolder(this.sourceGitRepositoryUri);
        const authenticatedGitUrl = this.getAuthenticatedGitUri(this.destinationGitRepositoryUri, this.gitMirrorPersonalAccessToken);

        console.log("Attempting to: git -C " + sourceGitFolder + " push --mirror " + authenticatedGitUrl);
        
        taskLib
            .tool("git")
            .arg("-C")
            .arg(sourceGitFolder)
            .arg("push")
            .arg("--mirror")
            .arg(authenticatedGitUrl)
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
