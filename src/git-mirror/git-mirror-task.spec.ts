import { expect } from "chai";
import * as sinon from "sinon";
import * as fs from "fs";
import * as path from "path";

import * as taskLib from "azure-pipelines-task-lib";
import { ToolRunner } from "azure-pipelines-task-lib/toolrunner";

import { GitMirrorTask } from "./git-mirror-task";

describe("GitMirrorTask", () => {
    const sourceUri = "https://github.com/swellaby/vsts-mirror-git-repository";
    const sourceUriInputKey = "sourceGitRepositoryUri";
    const sourcePAT = "xxxxxxxxxx";
    const sourceRepoCloneDirInputKey = "sourceGitRepositoryCloneDirectoryName";
    const sourceTokenInputKey = "sourceGitRepositoryPersonalAccessToken";
    const sourceVerifySSLCertificate = true;
    const sourceSSLInputKey = "sourceVerifySSLCertificate";
    const destinationUri = "https://github.com/swellaby/vsts-mirror-git-repository";
    const destinationUriInputKey = "destinationGitRepositoryUri";
    const destinationPAT = "xxxxxxxxxx";
    const destinationTokenInputKey = "destinationGitRepositoryPersonalAccessToken";
    const destinationVerifySSLCertificate = true;
    const destinationSSLInputKey = "destinationVerifySSLCertificate";

    let task: GitMirrorTask;
    let getInputStub: sinon.SinonStub;
    let getBoolInputStub: sinon.SinonStub;
    let setResultStub: sinon.SinonStub;
    const variableStubs: taskLib.VariableInfo[] = [
        {
            name: "1",
            value: "1",
            secret: false
        },
        {
            name: "2",
            value: "2",
            secret: false
        },
        {
            name: "3",
            value: "3",
            secret: false
        },
    ];

    const buildInvalidURIErrorMessage = (uri: string) => {
        return `Provided URI '${uri}' is not a valid URI`;
    };

    beforeEach(() => {
        sinon.stub(taskLib, "getVariables").callsFake(() => variableStubs);
        setResultStub = sinon.stub(taskLib, "setResult");
        getInputStub = sinon.stub(taskLib, "getInput");
        getBoolInputStub = sinon.stub(taskLib, "getBoolInput");
        getInputStub.withArgs(sourceUriInputKey, true).callsFake(() => sourceUri);
        getInputStub.withArgs(sourceTokenInputKey, false).callsFake(() => sourcePAT);
        getBoolInputStub.withArgs(sourceSSLInputKey, false).callsFake(() => sourceVerifySSLCertificate);
        getInputStub.withArgs(destinationUriInputKey, true).callsFake(() => destinationUri);
        getInputStub.withArgs(destinationTokenInputKey, false).callsFake(() => destinationPAT);
        getBoolInputStub.withArgs(destinationSSLInputKey, false).callsFake(() => destinationVerifySSLCertificate);
        task = new GitMirrorTask();
    });

    afterEach(() => {
        sinon.restore();
        task = null;
    });

    describe("inputs", () => {
        it("should use correct config for source git repository", () => {
            expect(getInputStub.calledWith(sourceUriInputKey, true)).to.be.true;
        });

        it("should use correct config for source git repository token", () => {
            expect(getInputStub.calledWithExactly(sourceTokenInputKey, false)).to.be.true;
        });

        it("should use correct config for source git repository ssl setting", () => {
            expect(getBoolInputStub.calledWithExactly(sourceSSLInputKey, false)).to.be.true;
        });

        it("should use correct config for destination git repository", () => {
            expect(getInputStub.calledWithExactly(destinationUriInputKey, true)).to.be.true;
        });

        it("should use correct config for destination git repository token", () => {
            expect(getInputStub.calledWithExactly(destinationTokenInputKey, true)).to.be.true;
        });

        it("should use correct config for destination git repository ssl setting", () => {
            expect(getBoolInputStub.calledWithExactly(destinationSSLInputKey, false)).to.be.true;
        });

        it("should fail the task if an invalid input is provided", () => {
            const err = new Error("invalid input");
            getInputStub.withArgs(destinationUriInputKey, true).throws(err);
            task = new GitMirrorTask();
            expect(setResultStub.calledWithExactly(taskLib.TaskResult.Failed, err)).to.be.true;
        });
    });

    describe("run", () => {
        let whichStub: sinon.SinonStub;
        let gitCloneMirrorStub: sinon.SinonStub;
        let gitPushMirrorStub: sinon.SinonStub;
        let removePullRequestRefsStub: sinon.SinonStub;

        beforeEach(function() {
            whichStub = sinon.stub(taskLib, "which");
            gitCloneMirrorStub = sinon.stub(task, "gitCloneMirror").resolves(0);
            removePullRequestRefsStub = sinon.stub(task, "removePullRequestRefs").resolves();
            gitPushMirrorStub = sinon.stub(task, "gitPushMirror").resolves(0);
        });

        it("should verify that the Git tool is installed on the build agent", () => {
            task.run();
            expect(whichStub.calledWithExactly("git", true)).to.be.true;
        });

        it("should fail the task if the Git tool is not installed on the build agent", () => {
            const err = new Error("git tool does not exist");
            whichStub.callsFake(() => { throw err; });
            new GitMirrorTask().run();
            expect(setResultStub.calledWithExactly(taskLib.TaskResult.Failed, err)).to.be.true;
        });

        it("should successfully perform a git clone and git push", async () => {
            await task.run();

            expect(setResultStub.calledWith(taskLib.TaskResult.Failed)).to.be.false;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(removePullRequestRefsStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.true;
        });

        it("should fail the task if the 'git clone --mirror ...' command throws an error", async () => {
            const cloneErrMsg = "An error occurred when attempting to clone the source repository. Please check output for more details.";
            gitCloneMirrorStub.resolves(1);

            await task.run();

            expect(setResultStub.calledWithExactly(taskLib.TaskResult.Failed, cloneErrMsg)).to.be.true;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(removePullRequestRefsStub.called).to.be.false;
            expect(gitPushMirrorStub.called).to.be.false;
        });

        it("should fail the task if an error occurs when trying to invoke git clone mirror", async () => {
            const err = new Error("clone crash");
            gitCloneMirrorStub.rejects(err);
            await task.run();

            expect(setResultStub.calledWithExactly(taskLib.TaskResult.Failed, err)).to.be.true;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(removePullRequestRefsStub.called).to.be.false;
            expect(gitPushMirrorStub.called).to.be.false;
        });

        it("should fail the task if an error occurs while removing PR refs", async () => {
            const err = new Error("PR refs removal crash");
            removePullRequestRefsStub.rejects(err);
            await task.run();

            expect(setResultStub.calledWithExactly(taskLib.TaskResult.Failed, err)).to.be.true;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(removePullRequestRefsStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.false;
        });

        it("should fail the task if the 'git push --mirror ...' command throws an error", async () => {
            const pushErrMsg = "An error occurred when attempting to push to the destination repository. Please check output for more details.";
            gitPushMirrorStub.resolves(1);

            await task.run();

            expect(setResultStub.calledWithExactly(taskLib.TaskResult.Failed, pushErrMsg)).to.be.true;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(removePullRequestRefsStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.true;
        });

        it("should fail the task if an error occurs when trying to invoke git push mirror", async () => {
            const err = new Error("push crash");
            gitPushMirrorStub.rejects(err);

            await task.run();

            expect(setResultStub.calledWithExactly(taskLib.TaskResult.Failed, err)).to.be.true;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(removePullRequestRefsStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.true;
        });
    });

    describe("mirror", () => {
        const toolRunnerStub: ToolRunner = {
            arg: (_val) => null,
            argIf: (_condition, _val) => null,
            exec: (_options) => null
        } as ToolRunner;
        const authenticatedUri = "authenticatedUri";
        const shouldVerifySSLCertificate = true;
        let getAuthenticatedGitUriStub: sinon.SinonStub;
        let toolStub: sinon.SinonStub;
        let argStub: sinon.SinonStub;
        let argIfStub: sinon.SinonStub;
        let execStub: sinon.SinonStub;

        beforeEach(() => {
            sinon.stub(task, "getSourceVerifySSLCertificate").callsFake(() => shouldVerifySSLCertificate);
            getAuthenticatedGitUriStub = sinon.stub(task, "getAuthenticatedGitUri").callsFake(() => authenticatedUri);
            toolStub = sinon.stub(taskLib, "tool").callsFake(() => toolRunnerStub);
            argStub = sinon.stub(toolRunnerStub, "arg").callsFake(() => toolRunnerStub);
            argIfStub = sinon.stub(toolRunnerStub, "argIf").callsFake(() => toolRunnerStub);
            execStub = sinon.stub(toolRunnerStub, "exec");
        });

        describe("gitCloneMirror", () => {
            it("should construct and execute a 'git clone --mirror ...' task with default clone directory", () => {
                task.gitCloneMirror();

                expect(getAuthenticatedGitUriStub.called).to.be.true;
                expect(toolStub.calledWith("git")).to.be.true;
                expect(argStub.firstCall.calledWith("clone")).to.be.true;
                expect(argStub.secondCall.calledWith("--mirror")).to.be.true;
                expect(argStub.thirdCall.calledWith(authenticatedUri)).to.be.true;
                expect(argStub.getCall(3).calledWith("vsts-mirror-git-repository.git")).to.be.true;
                expect(execStub.called).to.be.true;
            });

            it("should construct and execute a 'git clone --mirror ...' task with custom clone directory", () => {
                const expectedCloneDir = "foo";
                getInputStub.withArgs(sourceRepoCloneDirInputKey, false).callsFake(() => expectedCloneDir);
                const task = new GitMirrorTask();
                getAuthenticatedGitUriStub = sinon.stub(task, "getAuthenticatedGitUri").callsFake(() => authenticatedUri);
                task.gitCloneMirror();

                expect(getAuthenticatedGitUriStub.called).to.be.true;
                expect(toolStub.calledWith("git")).to.be.true;
                expect(argStub.firstCall.calledWith("clone")).to.be.true;
                expect(argStub.secondCall.calledWith("--mirror")).to.be.true;
                expect(argStub.thirdCall.calledWith(authenticatedUri)).to.be.true;
                expect(argStub.getCall(3).calledWith(expectedCloneDir)).to.be.true;
                expect(execStub.called).to.be.true;
            });

            it("should enable SSL certificate verification", () => {
                task.getSourceVerifySSLCertificate = () => true;
                getBoolInputStub.withArgs("sourceVerifySSLCertificate", false).callsFake(() => true);
                task.gitCloneMirror();

                expect(getAuthenticatedGitUriStub.called).to.be.true;
                expect(argIfStub.calledWithExactly(true, [ "-c", "http.sslVerify=true" ])).to.be.true;
                expect(argIfStub.calledWithExactly(false, [ "-c", "http.sslVerify=false" ])).to.be.true;
                expect(execStub.called).to.be.true;
            });

            it("should disable SSL certificate verification", () => {
                task.getSourceVerifySSLCertificate = () => false;
                task.gitCloneMirror();

                expect(getAuthenticatedGitUriStub.called).to.be.true;
                expect(argIfStub.calledWithExactly(false, [ "-c", "http.sslVerify=true" ])).to.be.true;
                expect(argIfStub.calledWithExactly(true, [ "-c", "http.sslVerify=false" ])).to.be.true;
                expect(execStub.called).to.be.true;
            });
        });

        describe("removePullRequestRefs", () => {
            const sourceRepoDirectory = "my-awesome-repo";
            const expPackedRefsFile = `${sourceRepoDirectory}.git/packed-refs`;
            const expPackedRefsFullFilePath = `/usr/foo/repo/${expPackedRefsFile}`;
            let pathResolveStub: sinon.SinonStub;
            let pathJoinStub: sinon.SinonStub;
            let fsReadFileStub: sinon.SinonStub;
            let fsWriteFileSyncStub: sinon.SinonStub;

            const branchRef1 = "6c0dae8d67774f521f4a8a10233f76c908f344ca refs/heads/master";
            const branchRef2 = "0cb21ae97c56d17a69525d46578f79544f6ddd2e refs/heads/develop";
            const tagRef1 = "50b2e2c3093ef7fbef802fddff6bf75f78c6b10b refs/tags/v0.0.12";
            const tagRef2 = "366ba8247ffda31a4ab8ee75cf636c46405a26fc refs/tags/v1.0.1";
            const pullRef1 = "66e5b2e17de107f5aa9ef0b64be8a0eeeb7511cf refs/pull/12/head";
            const pullRef2 = "9eb061c8e73b4c0a08613710daa3f5a93d47061d refs/pull/13/head";
            const mergeRequest1 = "1b60f335a6f3a4bbf7d56a8ae3106f6b3ea77891 refs/merge-requests/10/head";

            const updatedPackedRefsFileContents = "data: # pack-refs with: peeled fully-peeled sorted \\n" +
            `${branchRef1}\\n${branchRef2}\\n${tagRef1}\\n${tagRef2}\\n`;

            const originalPackedRefsFileContents = updatedPackedRefsFileContents +
                `${pullRef1}\\n${pullRef2}\\n${mergeRequest1}\\n`;

            beforeEach(() => {
                task.getDefaultGitCloneDirectory = () => sourceRepoDirectory;
                pathResolveStub = sinon.stub(path, "resolve").callsFake(() => expPackedRefsFullFilePath);
                pathJoinStub = sinon.stub(path, "join").callsFake(() => expPackedRefsFile);
                fsReadFileStub = sinon.stub(fs, "readFile").yields(null, originalPackedRefsFileContents);
                fsWriteFileSyncStub = sinon.stub(fs, "writeFileSync");
            });

            it("should reject when an error occurs", async () => {
                const expErr = new Error("oops!");
                pathJoinStub.throws(expErr);
                try {
                    await task.removePullRequestRefs();
                    expect(false).to.be.true;
                } catch (err) {
                    expect(err).to.equal(expErr);
                }
            });

            it("should reject when an error occurs while reading packed-refs file", async () => {
                const expErr = new Error("cannot read");
                fsReadFileStub.yields(expErr, undefined);

                try {
                    await task.removePullRequestRefs();
                    expect(false).to.be.true;
                } catch (err) {
                    expect(err).to.equal(expErr);
                }
            });

            it("should use correct file path to packed-refs file with default source clone directory", async () => {
                await task.removePullRequestRefs();
                expect(pathJoinStub.calledWithExactly(".", expPackedRefsFile));
                expect(pathResolveStub.calledWithExactly(expPackedRefsFile)).to.be.true;
            });

            it("should use correct file path to packed-refs file with custom source clone directory", async () => {
                const expectedCloneDir = "bar";
                getInputStub.withArgs(sourceRepoCloneDirInputKey, false).callsFake(() => expectedCloneDir);
                await new GitMirrorTask().removePullRequestRefs();

                expect(pathJoinStub.calledWithExactly(".", `${expectedCloneDir}/packed-refs`));
                expect(pathResolveStub.calledWithExactly(expPackedRefsFile)).to.be.true;
            });

            it("should use correct file encoding for read", async () => {
                await task.removePullRequestRefs();
                expect(fsReadFileStub.calledWith(expPackedRefsFullFilePath, "utf8"));
            });

            it("should update packed-refs file with no pull request refs", async () => {
                await task.removePullRequestRefs();
                expect(fsWriteFileSyncStub.calledWithExactly(expPackedRefsFullFilePath, updatedPackedRefsFileContents));
            });
        });

        describe("gitPushMirror", () => {
            const sourceRepoGitDir = "vsts-mirror-git-repository.git";
            beforeEach(() => {
                task.getDestinationVerifySSLCertificate = () => shouldVerifySSLCertificate;
                task.getAuthenticatedGitUri = () => authenticatedUri;
            });

            it("should construct and execute a 'git push --mirror ...' task with default source clone directory", () => {
                task.gitPushMirror();

                expect(toolStub.calledWith("git")).to.be.true;
                expect(argStub.getCall(0).calledWith("-C")).to.be.true;
                expect(argStub.getCall(1).calledWith(sourceRepoGitDir)).to.be.true;
                expect(argStub.getCall(2).calledWith("push")).to.be.true;
                expect(argStub.getCall(3).calledWith("--mirror")).to.be.true;
                expect(argStub.getCall(4).calledWith(authenticatedUri)).to.be.true;
                expect(execStub.called).to.be.true;
            });

            it("should construct and execute a 'git push --mirror ...' task with custom source clone directory", () => {
                const expectedCloneDir = "baz";
                getInputStub.withArgs(sourceRepoCloneDirInputKey, false).callsFake(() => expectedCloneDir);
                const task = new GitMirrorTask();
                task.getAuthenticatedGitUri = () => authenticatedUri;
                task.gitPushMirror();

                expect(toolStub.calledWith("git")).to.be.true;
                expect(argStub.getCall(0).calledWith("-C")).to.be.true;
                expect(argStub.getCall(1).calledWith(expectedCloneDir)).to.be.true;
                expect(argStub.getCall(2).calledWith("push")).to.be.true;
                expect(argStub.getCall(3).calledWith("--mirror")).to.be.true;
                expect(argStub.getCall(4).calledWith(authenticatedUri)).to.be.true;
                expect(execStub.called).to.be.true;
            });

            it("should enable SSL certificate verification", () => {
                task.getDestinationVerifySSLCertificate = () => true;
                task.gitPushMirror();

                expect(argIfStub.calledWithExactly(true, [ "-c", "http.sslVerify=true" ])).to.be.true;
                expect(argIfStub.calledWithExactly(false, [ "-c", "http.sslVerify=false" ])).to.be.true;
                expect(execStub.called).to.be.true;
            });

            it("should disable SSL certificate verification", () => {
                task.getDestinationVerifySSLCertificate = () => false;
                task.gitPushMirror();

                expect(argIfStub.calledWithExactly(false, [ "-c", "http.sslVerify=true" ])).to.be.true;
                expect(argIfStub.calledWithExactly(true, [ "-c", "http.sslVerify=false" ])).to.be.true;
                expect(execStub.called).to.be.true;
            });
        });
    });

    describe("getSourceVerifySSLCertificate", () => {
        it("should return true when source verify ssl certificate flag is true", () => {
            getBoolInputStub.withArgs(sourceSSLInputKey, false).callsFake(() => true);
            expect(new GitMirrorTask().getSourceVerifySSLCertificate()).to.be.true;
        });

        it("should return false when source verify ssl certificate flag is false", () => {
            getBoolInputStub.withArgs(sourceSSLInputKey, false).callsFake(() => false);
            expect(new GitMirrorTask().getSourceVerifySSLCertificate()).to.be.false;
        });
    });

    describe("getDestinationVerifySSLCertificate", () => {
        it("should return true when destination verify ssl certificate flag is true", () => {
            getBoolInputStub.withArgs(destinationSSLInputKey, false).callsFake(() => true);
            expect(new GitMirrorTask().getDestinationVerifySSLCertificate()).to.be.true;
        });

        it("should return false when destination verify ssl certificate flag is false", () => {
            getBoolInputStub.withArgs(destinationSSLInputKey, false).callsFake(() => false);
            expect(new GitMirrorTask().getDestinationVerifySSLCertificate()).to.be.false;
        });
    });

    describe("getDefaultGitCloneDirectory", () => {
        it("should fail if the given URI is undefined", () => {
            const sourceGitUri = undefined;
            const expErrorMessage = buildInvalidURIErrorMessage(sourceGitUri);
            expect(() => task.getDefaultGitCloneDirectory(sourceGitUri)).to.throw(expErrorMessage);
        });

        it("should fail if the given URI is not a valid URI", () => {
            const sourceGitUri = "invalidUri";
            const expErrorMessage = buildInvalidURIErrorMessage(sourceGitUri);
            expect(() => task.getDefaultGitCloneDirectory(sourceGitUri)).to.throw(expErrorMessage);
        });

        it("should extract a folder name from a given uri", () => {
            const sourceGitUri = "https://github.com/swellaby/vsts-mirror-git-repository";
            const folder = task.getDefaultGitCloneDirectory(sourceGitUri);
            expect(folder).to.be.equal("vsts-mirror-git-repository.git");
        });

        it("should extract a folder name from a given uri with a .git extension", () => {
            const sourceGitUri = "https://github.com/swellaby/vsts-mirror-git-repository.git";
            const folder = task.getDefaultGitCloneDirectory(sourceGitUri);
            expect(folder).to.be.equal("vsts-mirror-git-repository.git");
        });
    });

    describe("getAuthenticatedGitUri", () => {
        it("should fail if the given URI is undefined", () => {
            const uri = undefined;
            const token = "token";
            const expErrorMessage = buildInvalidURIErrorMessage(uri);
            expect(() => task.getAuthenticatedGitUri(uri, token)).to.throw(expErrorMessage);
        });

        it("should fail if the given URI is not a valid URI", () => {
            const uri = "invalidUri";
            const token = "token";
            const expErrorMessage = buildInvalidURIErrorMessage(uri);
            expect(() => task.getAuthenticatedGitUri(uri, token)).to.throw(expErrorMessage);
        });

        it("should return URI if no token is specified", () => {
            const uri = "https://github.com/swellaby/vsts-mirror-git-repository";
            const token = undefined;
            expect(task.getAuthenticatedGitUri(uri, token)).to.be.equal(uri);
        });

        it("should return a uri with the PAT token injected given the uri contains a http protocol", () => {
            const uri = "http://github.com/swellaby/vsts-mirror-git-repository";
            const token = "token";
            const expUri = `http://${token}@github.com/swellaby/vsts-mirror-git-repository`;
            expect(task.getAuthenticatedGitUri(uri, token)).to.be.equal(expUri);
        });

        it("should return a uri with the PAT token injected given the uri contains a https protocol", () => {
            const uri = "https://github.com/swellaby/vsts-mirror-git-repository";
            const token = "token";
            const expUri = `https://${token}@github.com/swellaby/vsts-mirror-git-repository`;
            expect(task.getAuthenticatedGitUri(uri, token)).to.be.equal(expUri);
        });
    });
});
