import * as taskLib from 'vsts-task-lib';

export class GitMirrorTask {

    private gitMirrorRepositoryUri: string;
    private gitMirrorPersonalAccessToken: string;
    private sourceGitRepositoryUri: string;

    public constructor() {
        try {
            this.gitMirrorRepositoryUri = taskLib.getInput('gitMirrorRepositoryUri', true);
            this.gitMirrorPersonalAccessToken = taskLib.getInput('gitMirrorPersonalAccessToken', true);
            this.sourceGitRepositoryUri = taskLib.getInput('$(Build.Repository.Uri)', true);
        }
        catch (e) {
            //
        }
    }

    public run() {
        try {
            // check if git exists as a tool
            taskLib.which('git', true);


            console.log('********* ' + this.sourceGitRepositoryUri);
        }
        catch (e) {
            taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
        finally {
            // this.onComplete();
        }
    }

    private gitCloneMirror() {
        taskLib.tool('git')
                .arg('clone')
                .arg('--mirror')
                .arg('$(Build.Repository.Uri)')
                .exec();
    }

    private gitPushMirror() {
        //
    }

    private onComplete() {
        try {
            //
        }
        catch (e) {
            taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }
}

const gitMirrorTask = new GitMirrorTask();
gitMirrorTask.run();
