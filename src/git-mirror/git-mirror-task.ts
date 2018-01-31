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

            this.gitCloneMirror();
            this.gitPushMirror();
        }
        catch (e) {
            // taskLib.setResult(taskLib.TaskResult.Failed, e);
        }
    }

    private gitCloneMirror() {
        // taskLib.tool('git')
        //         .arg('clone')
        //         .arg('--mirror')
        //         .arg(this.sourceGitRepositoryUri)
        //         .exec();
    }

    private gitPushMirror() {
        console.log('***** git push mirror ***** - ' + this.getAuthenticatedGitUri(this.destinationGitRepositoryUri, this.gitMirrorPersonalAccessToken));
        // taskLib.tool('git')
        //         .arg('-C')
        //         .arg(this.getSourceGitFolder(this.sourceGitRepositoryUri))
        //         .arg('push')
        //         .arg('--mirror')
        //         .arg(this.getAuthenticatedGitUri(this.destinationGitRepositoryUri, this.gitMirrorPersonalAccessToken))
        //         .exec();
    }

    private getSourceGitFolder(uri: string): string {
        if (uri !== undefined) {
            return uri.substring(uri.lastIndexOf('/') + 1) + '.git';
        }
        else {
            throw new Error('source uri is undefined');
        }
    }

    private getAuthenticatedGitUri(uri: string, token: string): string {
        if (uri === undefined) {
            throw new Error('destination uri is undefined');
        }
        else if (token === undefined) {
            throw new Error('personal access token is undefined');
        }
        else {
            console.log('getAuthenticatedGitUrl = uri.indexOf = ' + uri.indexOf('//'));
            const protocol = uri.substring(0, uri.indexOf('//'));
            console.log('getAuthenticatedGitUrl = protocol = ' + protocol);
            if (protocol === 'http' || protocol === 'https') {
                const address = uri.substring(uri.indexOf('//') + 2);
                console.log('getAuthenticatedGitUrl = address = ' + address);
                return protocol + '//' + token + '@' + address;
            }
            else {
                return token + '@' + uri;
            }
        }    
    }
}

const gitMirrorTask = new GitMirrorTask();
gitMirrorTask.run();
