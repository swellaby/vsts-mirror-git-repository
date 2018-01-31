import * as taskLib from 'vsts-task-lib';

export class GitMirrorTask {

    private gitMirrorRepositoryUrl: string;

    public constructor() {
        this.gitMirrorRepositoryUrl = taskLib.getInput('gitMirrorRepositoryUrl', true);
    }

    public run() {
        try {
            console.log('********* ' + this.gitMirrorRepositoryUrl);
        }
        catch (e) {
            taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
        finally {
            // this.onComplete();
        }
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
