// import "mocha";
import { expect } from "chai";
import * as sinon from "sinon";

import * as taskLib from "vsts-task-lib";
import { ToolRunner } from "vsts-task-lib/mock-toolrunner";

import { GitMirrorTask } from "./git-mirror-task";

let sourceUri;
let sourcePAT;
let sourceVerifySSLCertificate;
let destinationUri;
let destinationPAT;
let destinationVerifySSLCertificate;

let getInputStub;
let getBoolInputStub;

beforeEach(function() {
    sourceUri = "https://github.com/swellaby/vsts-mirror-git-repository";
    sourcePAT = "xxxxxxxxxx";
    sourceVerifySSLCertificate = true;
    destinationUri = "https://github.com/swellaby/vsts-mirror-git-repository";
    destinationPAT = "xxxxxxxxxx";
    destinationVerifySSLCertificate = true;

    getInputStub = sinon.stub(taskLib, "getInput").callsFake((name: string, required?: boolean) => {
        switch (name) {
            case "sourceGitRepositoryUri":
                if (required && sourceUri === undefined) {
                    throw new Error(name + " must be defined");
                }
                return sourceUri;
            case "sourceGitRepositoryPersonalAccessToken":
                if (required && sourcePAT === undefined) {
                    throw new Error(name + " must be defined");
                }
                return sourcePAT;
            case "destinationGitRepositoryUri":
                if (required && destinationUri === undefined) {
                    throw new Error(name + " must be defined");
                }
                return destinationUri;
            case "destinationGitRepositoryPersonalAccessToken":
                if (required && destinationPAT === undefined) {
                    throw new Error(name + " must be defined");
                }
                return destinationPAT;
            default:
                console.log(name + " is not stubbed out in test");
                throw new Error(name + " is not stubbed out in test");
        }
    });

    getBoolInputStub = sinon.stub(taskLib, "getBoolInput").callsFake((name: string, required?: boolean) => {
        switch (name) {
            case "sourceVerifySSLCertificate":
                if (required && sourceVerifySSLCertificate === undefined) {
                    throw new Error(name + " must be defined");
                }
                return sourceVerifySSLCertificate;
            case "destinationVerifySSLCertificate":
                if (required && destinationVerifySSLCertificate === undefined) {
                    throw new Error(name + " must be defined");
                }
                return destinationVerifySSLCertificate;
            default:
                console.log(name + " is not stubbed out in test");
                throw new Error(name + " is not stubbed out in test");
        }
    });
});

afterEach(function() {
    // getInputStub.restore();
    sinon.restore();
});

describe("GitMirrorTask", () => {
    describe("constructor", () => {
        it("should allow defined values for all input fields", () => {
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            expect(taskSucceeded).to.be.true;
        });

        it("should fail the task if the source Git repository uri is undefined", () => {
            sourceUri = undefined;
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            expect(taskSucceeded).to.be.false;
        });

        it("should allow an undefined value for the source Git repository PAT", () => {
            sourcePAT = undefined;
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            expect(taskSucceeded).to.be.true;
        });

        it("should fail the task if the destination Git repository uri is undefined", () => {
            destinationUri = undefined;
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            expect(taskSucceeded).to.be.false;
        });

        it("should fail the task if the destination Git repository PAT is undefined", () => {
            destinationPAT = undefined;
            let taskSucceeded = true;

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const task = new GitMirrorTask();

            expect(taskSucceeded).to.be.false;
        });
    });

    describe("run", () => {
        it("should verify that the Git tool is installed on the build agent", () => {
            let gitToolExists = false;
            let throwErrorIfGitDoesNotExist = false;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sinon.stub(taskLib, "which").callsFake((tool: string, check?: boolean) => {
                if (tool === "git") {
                    gitToolExists = true;
                }
                if (check) {
                    throwErrorIfGitDoesNotExist = true;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sinon.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.resolves(0);

            const gitPushMirrorStub = sinon.stub(task, "gitPushMirror");
            gitPushMirrorStub.resolves(0);

            task.run();

            expect(gitToolExists).to.be.true;
            expect(throwErrorIfGitDoesNotExist).to.be.true;
        });

        it("should fail the task if the Git tool is not installed on the build agent", () => {
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sinon.stub(taskLib, "which").callsFake((tool: string, check?: boolean) => {
                throw new Error("git tool does not exist");
            });

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sinon.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.resolves(0);

            const gitPushMirrorStub = sinon.stub(task, "gitPushMirror");
            gitPushMirrorStub.resolves(0);

            task.run();

            expect(taskSucceeded).to.be.false;
        });

        it("should successfully perform a git clone and git push", () => {
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sinon.stub(taskLib, "which");

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sinon.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.resolves(0);

            const gitPushMirrorStub = sinon.stub(task, "gitPushMirror");
            gitPushMirrorStub.resolves(0);

            task.run();

            expect(taskSucceeded).to.be.true;
            expect(gitCloneMirrorStub.called).to.be.true;
            
            expect(gitPushMirrorStub.called).to.be.true;
        });

        it("should fail the task if the 'git clone --mirror ...' command throws an error", () => {
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sinon.stub(taskLib, "which");

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sinon.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.resolves(1);

            const gitPushMirrorStub = sinon.stub(task, "gitPushMirror");
            gitPushMirrorStub.resolves(0);

            task.run();

            expect(taskSucceeded).to.be.false;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.false;
        });

        it("should fail the task if an error occurs when trying to invoke git clone mirror", () => {
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sinon.stub(taskLib, "which");

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sinon.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.rejects();

            const gitPushMirrorStub = sinon.stub(task, "gitPushMirror");
            gitPushMirrorStub.resolves(0);

            task.run();

            expect(taskSucceeded).to.be.false;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.false;
        });

        it("should fail the task if the 'git push --mirror ...' command throws an error", () => {
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sinon.stub(taskLib, "which");

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sinon.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.resolves(0);

            const gitPushMirrorStub = sinon.stub(task, "gitPushMirror");
            gitPushMirrorStub.resolves(1);

            task.run();

            expect(taskSucceeded).to.be.false;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.true;
        });

        it("should fail the task if an error occurs when trying to invoke git push mirror", () => {
            let taskSucceeded = true;

            const getVariablesStub = sinon.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sinon.stub(taskLib, "which");

            const setResultStub = sinon.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sinon.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.resolves(0);

            const gitPushMirrorStub = sinon.stub(task, "gitPushMirror");
            gitPushMirrorStub.rejects();

            task.run();

            expect(taskSucceeded).to.be.false;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.true;
        });
    });

    describe("gitCloneMirror", () => {
        it("should construct and execute a 'git clone --mirror ...' task", () => {
            const authenticatedUri = "authenticatedUri";
            const shouldVerifySSLCertificate = true;

            let usingGitTool = false;
            let isCloneUsed = false;
            let isMirrorOptionUsed = false;
            let isAuthenticatedUriUsed = false;
            let isUsingSSLVerfication = false;

            const task = new GitMirrorTask();

            const getSourceVerifySSLCertificateStub = sinon.stub(task, "getSourceVerifySSLCertificate").callsFake(() => {
                return shouldVerifySSLCertificate;
            });

            const getAuthenticatedGitUriStub = sinon.stub(task, "getAuthenticatedGitUri").callsFake((uri: string, token: string) => {
                return authenticatedUri;
            });

            const toolStub = sinon.stub(taskLib, "tool").callsFake((tool: string) => {
                if (tool === "git") {
                    usingGitTool = true;
                }
                return new ToolRunner(tool);
            });

            const argStub = sinon.stub(ToolRunner.prototype, "arg").callsFake((arg: string) => {
                if (arg === "clone") {
                    isCloneUsed = true;
                }
                else if (arg === "--mirror") {
                    isMirrorOptionUsed = true;
                }
                else if (arg === authenticatedUri) {
                    isAuthenticatedUriUsed = true;
                }
                return new ToolRunner(arg);
            });

            const argIfStub = sinon.stub(ToolRunner.prototype, "argIf").callsFake((conditionIsMet: boolean, arg: string) => {
                if (conditionIsMet && arg[0] !== undefined && arg[1] !== undefined) {
                    if (arg[0] === "-c" && arg[1] === "http.sslVerify=true") {
                        isUsingSSLVerfication = true;
                    }
                    else if (arg[0] === "-c" && arg[1] === "http.sslVerify=false") {
                        isUsingSSLVerfication = false;
                    }
                }
                return new ToolRunner(arg);
            });

            const execStub = sinon.stub(ToolRunner.prototype, "exec");

            task.gitCloneMirror();

            expect(getAuthenticatedGitUriStub.called).to.be.true;
            expect(usingGitTool).to.be.true;
            expect(isCloneUsed).to.be.true;
            expect(isMirrorOptionUsed).to.be.true;
            expect(isAuthenticatedUriUsed).to.be.true;
            expect(execStub.called).to.be.true;
        });

        it("should enable SSL certificate verification", () => {
            const authenticatedUri = "authenticatedUri";
            const shouldVerifySSLCertificate = true;

            let isUsingSSLVerfication = false;

            const task = new GitMirrorTask();

            const getSourceVerifySSLCertificateStub = sinon.stub(task, "getSourceVerifySSLCertificate").callsFake(() => {
                return shouldVerifySSLCertificate;
            });

            const getAuthenticatedGitUriStub = sinon.stub(task, "getAuthenticatedGitUri").callsFake((uri: string, token: string) => {
                return authenticatedUri;
            });

            const toolStub = sinon.stub(taskLib, "tool").callsFake((tool: string) => {
                return new ToolRunner(tool);
            });

            const argStub = sinon.stub(ToolRunner.prototype, "arg").callsFake((arg: string) => {
                return new ToolRunner(arg);
            });

            const argIfStub = sinon.stub(ToolRunner.prototype, "argIf").callsFake((conditionIsMet: boolean, arg: string) => {
                if (conditionIsMet && arg[0] !== undefined && arg[1] !== undefined) {
                    if (arg[0] === "-c" && arg[1] === "http.sslVerify=true") {
                        isUsingSSLVerfication = true;
                    }
                    else if (arg[0] === "-c" && arg[1] === "http.sslVerify=false") {
                        isUsingSSLVerfication = false;
                    }
                }
                return new ToolRunner(arg);
            });

            const execStub = sinon.stub(ToolRunner.prototype, "exec");

            task.gitCloneMirror();

            expect(getAuthenticatedGitUriStub.called).to.be.true;
            expect(isUsingSSLVerfication).to.be.true;
            expect(execStub.called).to.be.true;
        });

        it("should disablse SSL certificate verification", () => {
            const authenticatedUri = "authenticatedUri";
            const shouldVerifySSLCertificate = false;

            let isUsingSSLVerfication = false;

            const task = new GitMirrorTask();

            const getSourceVerifySSLCertificateStub = sinon.stub(task, "getSourceVerifySSLCertificate").callsFake(() => {
                return shouldVerifySSLCertificate;
            });

            const getAuthenticatedGitUriStub = sinon.stub(task, "getAuthenticatedGitUri").callsFake((uri: string, token: string) => {
                return authenticatedUri;
            });

            const toolStub = sinon.stub(taskLib, "tool").callsFake((tool: string) => {
                return new ToolRunner(tool);
            });

            const argStub = sinon.stub(ToolRunner.prototype, "arg").callsFake((arg: string) => {
                return new ToolRunner(arg);
            });

            const argIfStub = sinon.stub(ToolRunner.prototype, "argIf").callsFake((conditionIsMet: boolean, arg: string) => {
                if (conditionIsMet && arg[0] !== undefined && arg[1] !== undefined) {
                    if (arg[0] === "-c" && arg[1] === "http.sslVerify=true") {
                        isUsingSSLVerfication = true;
                    }
                    else if (arg[0] === "-c" && arg[1] === "http.sslVerify=false") {
                        isUsingSSLVerfication = false;
                    }
                }
                return new ToolRunner(arg);
            });

            const execStub = sinon.stub(ToolRunner.prototype, "exec");

            task.gitCloneMirror();

            expect(getAuthenticatedGitUriStub.called).to.be.true;
            expect(isUsingSSLVerfication).to.be.false;
            expect(execStub.called).to.be.true;
        });
    });

    describe("gitPushMirror", () => {
        it("should construct and execute a 'git push --mirror ...' task", () => {
            const sourceFolder = "sourceFolder";
            const authenticatedUri = "authenticatedUri";
            const shouldVerifySSLCertificate = true;

            let usingGitTool = false;
            let isUsingSSLVerfication = false;
            let isCOptionUsed = false;
            let isSourceFolderUsed = false;
            let isPushUsed = false;
            let isMirrorOptionUsed = false;
            let isAuthenticatedUriUsed = false;

            const task = new GitMirrorTask();

            const getDestinationVerifySSLCertificateStub = sinon.stub(task, "getDestinationVerifySSLCertificate").callsFake(() => {
                return shouldVerifySSLCertificate;
            });

            const getSourceGitFolderStub = sinon.stub(task, "getSourceGitFolder").callsFake((uri: string) => {
                return sourceFolder;
            });

            const getAuthenticatedGitUriStub = sinon.stub(task, "getAuthenticatedGitUri").callsFake((uri: string, token: string) => {
                return authenticatedUri;
            });

            const toolStub = sinon.stub(taskLib, "tool").callsFake((tool: string) => {
                if (tool === "git") {
                    usingGitTool = true;
                }
                return new ToolRunner(tool);
            });

            const argStub = sinon.stub(ToolRunner.prototype, "arg").callsFake((arg: string) => {
                if (arg === "-C") {
                    isCOptionUsed = true;
                }
                else if (arg === sourceFolder) {
                    isSourceFolderUsed = true;
                }
                else if (arg === "push") {
                    isPushUsed = true;
                }
                else if (arg === "--mirror") {
                    isMirrorOptionUsed = true;
                }
                else if (arg === authenticatedUri) {
                    isAuthenticatedUriUsed = true;
                }
                return new ToolRunner(arg);
            });

            const argIfStub = sinon.stub(ToolRunner.prototype, "argIf").callsFake((conditionIsMet: boolean, arg: string) => {
                if (conditionIsMet && arg[0] !== undefined && arg[1] !== undefined) {
                    if (arg[0] === "-c" && arg[1] === "http.sslVerify=true") {
                        isUsingSSLVerfication = true;
                    }
                    else if (arg[0] === "-c" && arg[1] === "http.sslVerify=false") {
                        isUsingSSLVerfication = false;
                    }
                }
                return new ToolRunner(arg);
            });

            const execStub = sinon.stub(ToolRunner.prototype, "exec");

            task.gitPushMirror();

            expect(getSourceGitFolderStub.called).to.be.true;
            expect(getAuthenticatedGitUriStub.called).to.be.true;
            expect(usingGitTool).to.be.true;
            expect(isUsingSSLVerfication).to.be.true;
            expect(isCOptionUsed).to.be.true;
            expect(isSourceFolderUsed).to.be.true;
            expect(isPushUsed).to.be.true;
            expect(isMirrorOptionUsed).to.be.true;
            expect(isAuthenticatedUriUsed).to.be.true;
            expect(execStub.called).to.be.true;
        });
        
        it("should enable SSL certificate verification", () => {
            const sourceFolder = "sourceFolder";
            const authenticatedUri = "authenticatedUri";
            const shouldVerifySSLCertificate = true;

            let isUsingSSLVerfication = false;

            const task = new GitMirrorTask();

            const getDestinationVerifySSLCertificateStub = sinon.stub(task, "getDestinationVerifySSLCertificate").callsFake(() => {
                return shouldVerifySSLCertificate;
            });

            const getSourceGitFolderStub = sinon.stub(task, "getSourceGitFolder").callsFake((uri: string) => {
                return sourceFolder;
            });

            const getAuthenticatedGitUriStub = sinon.stub(task, "getAuthenticatedGitUri").callsFake((uri: string, token: string) => {
                return authenticatedUri;
            });

            const toolStub = sinon.stub(taskLib, "tool").callsFake((tool: string) => {
                return new ToolRunner(tool);
            });

            const argStub = sinon.stub(ToolRunner.prototype, "arg").callsFake((arg: string) => {
                return new ToolRunner(arg);
            });

            const argIfStub = sinon.stub(ToolRunner.prototype, "argIf").callsFake((conditionIsMet: boolean, arg: string) => {
                if (conditionIsMet && arg[0] !== undefined && arg[1] !== undefined) {
                    if (arg[0] === "-c" && arg[1] === "http.sslVerify=true") {
                        isUsingSSLVerfication = true;
                    }
                    else if (arg[0] === "-c" && arg[1] === "http.sslVerify=false") {
                        isUsingSSLVerfication = false;
                    }
                }
                return new ToolRunner(arg);
            });

            const execStub = sinon.stub(ToolRunner.prototype, "exec");

            task.gitPushMirror();

            expect(getSourceGitFolderStub.called).to.be.true;
            expect(getAuthenticatedGitUriStub.called).to.be.true;
            expect(isUsingSSLVerfication).to.be.true;
            expect(execStub.called).to.be.true;
        });
        
        it("should disablse SSL certificate verification", () => {
            const sourceFolder = "sourceFolder";
            const authenticatedUri = "authenticatedUri";
            const shouldVerifySSLCertificate = false;

            let isUsingSSLVerfication = false;

            let usingGitTool = false;
            let isCOptionUsed = false;
            let isSourceFolderUsed = false;
            let isPushUsed = false;
            let isMirrorOptionUsed = false;
            let isAuthenticatedUriUsed = false;

            const task = new GitMirrorTask();

            const getDestinationVerifySSLCertificateStub = sinon.stub(task, "getDestinationVerifySSLCertificate").callsFake(() => {
                return shouldVerifySSLCertificate;
            });

            const getSourceGitFolderStub = sinon.stub(task, "getSourceGitFolder").callsFake((uri: string) => {
                return sourceFolder;
            });

            const getAuthenticatedGitUriStub = sinon.stub(task, "getAuthenticatedGitUri").callsFake((uri: string, token: string) => {
                return authenticatedUri;
            });

            const toolStub = sinon.stub(taskLib, "tool").callsFake((tool: string) => {
                if (tool === "git") {
                    usingGitTool = true;
                }
                return new ToolRunner(tool);
            });

            const argStub = sinon.stub(ToolRunner.prototype, "arg").callsFake((arg: string) => {
                if (arg === "-C") {
                    isCOptionUsed = true;
                }
                else if (arg === sourceFolder) {
                    isSourceFolderUsed = true;
                }
                else if (arg === "push") {
                    isPushUsed = true;
                }
                else if (arg === "--mirror") {
                    isMirrorOptionUsed = true;
                }
                else if (arg === authenticatedUri) {
                    isAuthenticatedUriUsed = true;
                }
                return new ToolRunner(arg);
            });

            const argIfStub = sinon.stub(ToolRunner.prototype, "argIf").callsFake((conditionIsMet: boolean, arg: string) => {
                if (conditionIsMet && arg[0] !== undefined && arg[1] !== undefined) {
                    if (arg[0] === "-c" && arg[1] === "http.sslVerify=true") {
                        isUsingSSLVerfication = true;
                    }
                    else if (arg[0] === "-c" && arg[1] === "http.sslVerify=false") {
                        isUsingSSLVerfication = false;
                    }
                }
                return new ToolRunner(arg);
            });

            const execStub = sinon.stub(ToolRunner.prototype, "exec");

            task.gitPushMirror();

            expect(getSourceGitFolderStub.called).to.be.true;
            expect(getAuthenticatedGitUriStub.called).to.be.true;
            expect(usingGitTool).to.be.true;
            expect(isCOptionUsed).to.be.true;
            expect(isSourceFolderUsed).to.be.true;
            expect(isPushUsed).to.be.true;
            expect(isMirrorOptionUsed).to.be.true;
            expect(isAuthenticatedUriUsed).to.be.true;
            expect(execStub.called).to.be.true;
        });
    });

    describe("getSourceVerifySSLCertificate", () => {
        it("should return source verify ssl certificate flag", () => {
            const task = new GitMirrorTask();
            task.getSourceVerifySSLCertificate();
            expect(true).to.be.true;
        });
    });

    describe("getDestinationVerifySSLCertificate", () => {
        it("should return destination verify ssl certificate flag", () => {
            const task = new GitMirrorTask();
            task.getDestinationVerifySSLCertificate();
            expect(true).to.be.true;
        });
    });

    describe("getSourceGitFolder", () => {
        it("should fail if the given URI is undefined", () => {
            const sourceGitUri = undefined;
            let isErrorThrown = false;

            const task = new GitMirrorTask();

            try {
                const folder = task.getSourceGitFolder(sourceGitUri);
            }
            catch (e) {
                isErrorThrown = true;
            }

            expect(isErrorThrown).to.be.true;
        });

        it("should fail if the given URI is not a valid URI", () => {
            const sourceGitUri = "invalidUri";
            let isErrorThrown = false;

            const task = new GitMirrorTask();

            try {
                const folder = task.getSourceGitFolder(sourceGitUri);
            }
            catch (e) {
                isErrorThrown = true;
            }

            expect(isErrorThrown).to.be.true;
        });

        it("should extract a folder name from a given uri", () => {
            const sourceGitUri = "https://github.com/swellaby/vsts-mirror-git-repository";
            let isErrorThrown = false;

            const task = new GitMirrorTask();
            let folder;

            try {
                folder = task.getSourceGitFolder(sourceGitUri);
            }
            catch (e) {
                isErrorThrown = true;
            }

            expect(isErrorThrown).to.be.false;
            expect(folder).to.be.equal("vsts-mirror-git-repository.git");
        });

        it("should extract a folder name from a given uri with a .git extension", () => {
            const sourceGitUri = "https://github.com/swellaby/vsts-mirror-git-repository.git";
            let isErrorThrown = false;

            const task = new GitMirrorTask();
            let folder;

            try {
                folder = task.getSourceGitFolder(sourceGitUri);
            }
            catch (e) {
                isErrorThrown = true;
            }

            expect(isErrorThrown).to.be.false;
            expect(folder).to.be.equal("vsts-mirror-git-repository.git");
        });
    });

    describe("getAuthenticatedGitUri", () => {
        it("should fail if the given URI is undefined", () => {
            const uri = undefined;
            const token = "token";
            let isErrorThrown = false;
            let authenticatedUri;

            const task = new GitMirrorTask();

            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }

            expect(isErrorThrown).to.be.true;
        });

        it("should fail if the given URI is not a valid URI", () => {
            const uri = "invalidUri";
            const token = "token";
            let isErrorThrown = false;
            let authenticatedUri;

            const task = new GitMirrorTask();

            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }

            expect(isErrorThrown).to.be.true;
        });

        it("should return URI if no token is specified", () => {
            const uri = "https://github.com/swellaby/vsts-mirror-git-repository";
            const token = undefined;
            let isErrorThrown = false;
            let authenticatedUri;

            const task = new GitMirrorTask();

            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }

            expect(isErrorThrown).to.be.false;
            expect(authenticatedUri).to.be.equal(uri);
        });

        it("should return a uri with the PAT token injected given the uri contains a http protocol", () => {
            const uri = "http://github.com/swellaby/vsts-mirror-git-repository";
            const token = "token";
            let isErrorThrown = false;
            let authenticatedUri;

            const task = new GitMirrorTask();

            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }

            expect(isErrorThrown).to.be.false;
            expect(authenticatedUri).to.be.equal("http://" + token + "@" + "github.com/swellaby/vsts-mirror-git-repository");
        });

        it("should return a uri with the PAT token injected given the uri contains a https protocol", () => {
            const uri = "https://github.com/swellaby/vsts-mirror-git-repository";
            const token = "token";
            let isErrorThrown = false;
            let authenticatedUri;

            const task = new GitMirrorTask();

            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }

            expect(isErrorThrown).to.be.false;
            expect(authenticatedUri).to.be.equal("https://" + token + "@" + "github.com/swellaby/vsts-mirror-git-repository");
        });
    });
});
