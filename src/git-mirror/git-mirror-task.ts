import * as taskLib from 'vsts-task-lib';

export class GitMirrorTask {

    private destinationGitRepositoryUri: string;
    private gitMirrorPersonalAccessToken: string;
    private sourceGitRepositoryUri: string;

    public constructor() {
        try {
            this.sourceGitRepositoryUri = taskLib.getInput('sourceGitRepositoryUri', true);
            this.destinationGitRepositoryUri = taskLib.getInput('destinationGitRepositoryUri', true);
            this.gitMirrorPersonalAccessToken = taskLib.getInput('gitMirrorPersonalAccessToken', true);
        }
        catch (e) {
            // taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }

    public run() {
        try {
            // check if git exists as a tool
            taskLib.which('git', true);

            // this.gitCloneMirror();
            // this.gitPushMirror();

            console.log('********* ' + this.sourceGitRepositoryUri);
        }
        catch (e) {
            taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }

    private gitCloneMirror() {
        taskLib.tool('git')
                .arg('clone')
                .arg('--mirror')
                .arg(this.sourceGitRepositoryUri)
                .exec();
    }

    private gitPushMirror() {
        taskLib.tool('git')
                .arg('-C')
                .arg(this.getSourceGitFolder(this.sourceGitRepositoryUri))
                .arg('push')
                .arg('--mirror')
                .arg(this.getAuthenticatedGitUri(this.destinationGitRepositoryUri, this.gitMirrorPersonalAccessToken))
                .exec();
    }

    private getSourceGitFolder(uri: string): string {
        //

        return '';
    }

    private getAuthenticatedGitUri(uri: string, token: string): string {
        //

        return '';
    }
}

const gitMirrorTask = new GitMirrorTask();
gitMirrorTask.run();
