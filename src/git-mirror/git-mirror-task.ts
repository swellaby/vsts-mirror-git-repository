import * as taskLib from "vsts-task-lib";

export class GitMirrorTask {
    private sourceGitRepositoryUri: string;
    private sourceGitRepositoryPersonalAccessToken: string;
    private destinationGitRepositoryUri: string;
    private destinationGitRepositoryPersonalAccessToken: string;

    public constructor() {
        try {
            console.log("**** variables");
            taskLib.getVariables().forEach((variable) => {
                console.log(variable);
            });
            console.log("**** end variables");

            this.sourceGitRepositoryUri = taskLib.getInput("sourceGitRepositoryUri", true);
            this.sourceGitRepositoryPersonalAccessToken = taskLib.getInput("sourceGitRepositoryPersonalAccessToken", false);
            this.destinationGitRepositoryUri = taskLib.getInput("destinationGitRepositoryUri", true);
            this.destinationGitRepositoryPersonalAccessToken = taskLib.getInput("destinationGitRepositoryPersonalAccessToken", true);
        } catch (e) {
            taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }

    public run() {
        try {
            if (this.sourceGitRepositoryUri === undefined ||
                this.destinationGitRepositoryUri === undefined ||
                this.destinationGitRepositoryPersonalAccessToken === undefined) {
                taskLib.setResult(taskLib.TaskResult.SucceededWithIssues, "");
                return;
            }

            // check if git exists as a tool
            taskLib.which("git", true);

            this.gitCloneMirror().then((code) => {
                if (code !== 0) {
                    taskLib.setResult(taskLib.TaskResult.Failed, "An error occurred when attempting to clone the source repository. Please check output for more details.");
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

    public gitCloneMirror() {
        const authenticatedSourceGitUrl = this.getAuthenticatedGitUri(this.sourceGitRepositoryUri, this.sourceGitRepositoryPersonalAccessToken);

        console.log("Attempting to: git clone --mirror " + this.sourceGitRepositoryUri);

        return taskLib
            .tool("git")
            .arg("clone")
            .arg("--mirror")
            .arg(authenticatedSourceGitUrl)
            .exec();
    }

    public gitPushMirror() {
        const sourceGitFolder = this.getSourceGitFolder(this.sourceGitRepositoryUri);
        const authenticatedDestinationGitUrl = this.getAuthenticatedGitUri(this.destinationGitRepositoryUri, this.destinationGitRepositoryPersonalAccessToken);

        console.log("Attempting to: git -C " + sourceGitFolder + " push --mirror " + authenticatedDestinationGitUrl);
        
        return taskLib
            .tool("git")
            .arg("-C")
            .arg(sourceGitFolder)
            .arg("push")
            .arg("--mirror")
            .arg(authenticatedDestinationGitUrl)
            .exec();
    }

    public getSourceGitFolder(uri: string): string {
        return uri.substring(uri.lastIndexOf("/") + 1) + ".git";
    }

    public getAuthenticatedGitUri(uri: string, token: string): string {
        if (token === undefined) {
            return uri;
        }
        else {
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
}

const gitMirrorTask = new GitMirrorTask();
gitMirrorTask.run();
