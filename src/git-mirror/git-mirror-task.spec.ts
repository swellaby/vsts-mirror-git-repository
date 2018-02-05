import "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
const sinonStubPromise = require("sinon-stub-promise");
sinonStubPromise(sinon);

import * as taskLib from "vsts-task-lib";
import { ToolRunner } from "vsts-task-lib/mock-toolrunner";

import { GitMirrorTask } from "./git-mirror-task";

let sourceUri;
let sourcePAT;
let destinationUri;
let destinationPAT;
let getInputStub;

let sandbox;

beforeEach(function() {
    sourceUri = "https://github.com/traviskosarek/traviskosarek-com";
    sourcePAT = "xxxxxxxxxx";
    destinationUri = "https://github.com/traviskosarek/traviskosarek-com";
    destinationPAT = "xxxxxxxxxx";

    sandbox = sinon.sandbox.create();

    getInputStub = sandbox.stub(taskLib, "getInput").callsFake((name: string, required?: boolean) => {
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
});

afterEach(function() {
    getInputStub.restore();
    sandbox.restore();
});

describe("GitMirrorTask", () => {
    describe("constructor", () => {
        it("should allow defined values for all input fields", () => {
            // arrange
            let taskSucceeded = true;

            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            // act
            const task = new GitMirrorTask();

            // assert
            expect(taskSucceeded).to.be.true;

            // cleanup
            getVariablesStub.restore();
            setResultStub.restore();
        });

        it("should fail the task if the source Git repository uri is undefined", () => {
            // arrange
            sourceUri = undefined;
            let taskSucceeded = true;

            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            // act
            const task = new GitMirrorTask();

            // assert
            expect(taskSucceeded).to.be.false;

            // cleanup
            getVariablesStub.restore();
            setResultStub.restore();
        });

        it("should allow an undefined value for the source Git repository PAT", () => {
            // arrange
            sourcePAT = undefined;
            let taskSucceeded = true;

            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            // act
            const task = new GitMirrorTask();

            // assert
            expect(taskSucceeded).to.be.true;

            // cleanup
            getVariablesStub.restore();
            setResultStub.restore();
        });

        it("should fail the task if the destination Git repository uri is undefined", () => {
            // arrange
            destinationUri = undefined;
            let taskSucceeded = true;

            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            // act
            const task = new GitMirrorTask();

            // assert
            expect(taskSucceeded).to.be.false;

            // cleanup
            getVariablesStub.restore();
            setResultStub.restore();
        });

        it("should fail the task if the destination Git repository PAT is undefined", () => {
            // arrange
            destinationPAT = undefined;
            let taskSucceeded = true;

            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            // act
            const task = new GitMirrorTask();

            // assert
            expect(taskSucceeded).to.be.false;

            // cleanup
            getVariablesStub.restore();
            setResultStub.restore();
        });
    });

    describe("run", () => {
        it("should verify that the Git tool is installed on the build agent", () => {
            // arrange
            let gitToolExists = false;
            let throwErrorIfGitDoesNotExist = false;

            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sandbox.stub(taskLib, "which").callsFake((tool: string, check?: boolean) => {
                if (tool === "git") {
                    gitToolExists = true;
                }
                if (check) {
                    throwErrorIfGitDoesNotExist = true;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sandbox.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.returnsPromise().resolves(0);
            
            const gitPushMirrorStub = sandbox.stub(task, "gitPushMirror");
            gitPushMirrorStub.returnsPromise().resolves(0);

            // act
            task.run();

            // assert
            expect(gitToolExists).to.be.true;
            expect(throwErrorIfGitDoesNotExist).to.be.true;

            // cleanup
            getVariablesStub.restore();
            whichStub.restore();
            gitCloneMirrorStub.restore();
            gitPushMirrorStub.restore();
        });
        
        it("should fail the task if the Git tool is not installed on the build agent", () => {
            // arrange
            let taskSucceeded = true;

            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sandbox.stub(taskLib, "which").callsFake((tool: string, check?: boolean) => {
                throw new Error("git tool does not exist");
            });
            
            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sandbox.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.returnsPromise().resolves(0);
            
            const gitPushMirrorStub = sandbox.stub(task, "gitPushMirror");
            gitPushMirrorStub.returnsPromise().resolves(0);

            // act
            task.run();

            // assert
            expect(taskSucceeded).to.be.false;
            
            // cleanup
            getVariablesStub.restore();
            whichStub.restore();
            setResultStub.restore();
            gitCloneMirrorStub.restore();
            gitPushMirrorStub.restore();
        });
        
        it("should successfully perform a git clone and git push", () => {
            let taskSucceeded = true;
            
            // arrange
            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sandbox.stub(taskLib, "which");
            
            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sandbox.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.returnsPromise().resolves(0);
            
            const gitPushMirrorStub = sandbox.stub(task, "gitPushMirror");
            gitPushMirrorStub.returnsPromise().resolves(0);

            // act
            task.run();

            // assert
            expect(taskSucceeded).to.be.true;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.true;
            
            // cleanup
            getVariablesStub.restore();
            whichStub.restore();
            setResultStub.restore();
            gitCloneMirrorStub.restore();
            gitPushMirrorStub.restore();
        });
        
        it("should fail the task if the 'git clone --mirror ...' command throws an error", () => {
            let taskSucceeded = true;
            
            // arrange
            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sandbox.stub(taskLib, "which");
            
            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sandbox.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.returnsPromise().resolves(1);
            
            const gitPushMirrorStub = sandbox.stub(task, "gitPushMirror");
            gitPushMirrorStub.returnsPromise().resolves(0);

            // act
            task.run();

            // assert
            expect(taskSucceeded).to.be.false;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.false;
            
            // cleanup
            getVariablesStub.restore();
            whichStub.restore();
            setResultStub.restore();
            gitCloneMirrorStub.restore();
            gitPushMirrorStub.restore();
        });
        
        it("should fail the task if an error occurs when trying to invoke git clone mirror", () => {
            let taskSucceeded = true;
            
            // arrange
            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sandbox.stub(taskLib, "which");
            
            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sandbox.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.returnsPromise().rejects();
            
            const gitPushMirrorStub = sandbox.stub(task, "gitPushMirror");
            gitPushMirrorStub.returnsPromise().resolves(0);

            // act
            task.run();

            // assert
            expect(taskSucceeded).to.be.false;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.false;
            
            // cleanup
            getVariablesStub.restore();
            whichStub.restore();
            setResultStub.restore();
            gitCloneMirrorStub.restore();
            gitPushMirrorStub.restore();
        });

        it("should fail the task if the 'git push --mirror ...' command throws an error", () => {
            let taskSucceeded = true;
            
            // arrange
            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sandbox.stub(taskLib, "which");
            
            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sandbox.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.returnsPromise().resolves(0);
            
            const gitPushMirrorStub = sandbox.stub(task, "gitPushMirror");
            gitPushMirrorStub.returnsPromise().resolves(1);

            // act
            task.run();

            // assert
            expect(taskSucceeded).to.be.false;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.true;
            
            // cleanup
            getVariablesStub.restore();
            whichStub.restore();
            setResultStub.restore();
            gitCloneMirrorStub.restore();
            gitPushMirrorStub.restore();
        });
        
        it("should fail the task if an error occurs when trying to invoke git push mirror", () => {
            let taskSucceeded = true;
            
            // arrange
            const getVariablesStub = sandbox.stub(taskLib, "getVariables").callsFake(() => {
                return ["1", "2", "3"];
            });

            const whichStub = sandbox.stub(taskLib, "which");
            
            const setResultStub = sandbox.stub(taskLib, "setResult").callsFake((result: taskLib.TaskResult, message: string) => {
                if (result === taskLib.TaskResult.Failed) {
                    taskSucceeded = false;
                }
            });

            const task = new GitMirrorTask();

            const gitCloneMirrorStub = sandbox.stub(task, "gitCloneMirror");
            gitCloneMirrorStub.returnsPromise().resolves(0);
            
            const gitPushMirrorStub = sandbox.stub(task, "gitPushMirror");
            gitPushMirrorStub.returnsPromise().rejects();

            // act
            task.run();

            // assert
            expect(taskSucceeded).to.be.false;
            expect(gitCloneMirrorStub.called).to.be.true;
            expect(gitPushMirrorStub.called).to.be.true;
            
            // cleanup
            getVariablesStub.restore();
            whichStub.restore();
            setResultStub.restore();
            gitCloneMirrorStub.restore();
            gitPushMirrorStub.restore();
        });
    });

    describe("gitCloneMirror", () => {
        it("should construct and execute a 'git clone --mirror ...' task", () => {
            const authenticatedUri = "authenticatedUri";
            
            let usingGitTool = false;
            let isCloneUsed = false;
            let isMirrorOptionUsed = false;
            let isAuthenticatedUriUsed = false;
            
            const task = new GitMirrorTask();
            
            // arrange
            const getAuthenticatedGitUriStub = sandbox.stub(task, "getAuthenticatedGitUri").callsFake((uri: string, token: string) => {
                return authenticatedUri;
            });
            
            const toolStub = sandbox.stub(taskLib, "tool").callsFake((tool: string) => {
                if (tool === "git") {
                    usingGitTool = true;
                }
                return new ToolRunner(tool);
            });

            const argStub = sandbox.stub(ToolRunner.prototype, "arg").callsFake((arg: string) => {
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

            const execStub = sandbox.stub(ToolRunner.prototype, "exec");

            // act
            task.gitCloneMirror();

            // assert
            expect(getAuthenticatedGitUriStub.called).to.be.true;
            expect(usingGitTool).to.be.true;
            expect(isCloneUsed).to.be.true;
            expect(isMirrorOptionUsed).to.be.true;
            expect(isAuthenticatedUriUsed).to.be.true;
            expect(execStub.called).to.be.true;
            
            // cleanup
            getAuthenticatedGitUriStub.restore();
            toolStub.restore();
            argStub.restore();
            execStub.restore();
        });
    });

    describe("gitPushMirror", () => {
        it("should construct and execute a 'git push --mirror ...' task", () => {
            const sourceFolder = "sourceFolder";
            const authenticatedUri = "authenticatedUri";
            
            let usingGitTool = false;
            let isCOptionUsed = false;
            let isSourceFolderUsed = false;
            let isPushUsed = false;
            let isMirrorOptionUsed = false;
            let isAuthenticatedUriUsed = false;
            
            const task = new GitMirrorTask();
            
            // arrange
            const getSourceGitFolderStub = sandbox.stub(task, "getSourceGitFolder").callsFake((uri: string) => {
                return sourceFolder;
            });

            const getAuthenticatedGitUriStub = sandbox.stub(task, "getAuthenticatedGitUri").callsFake((uri: string, token: string) => {
                return authenticatedUri;
            });
            
            const toolStub = sandbox.stub(taskLib, "tool").callsFake((tool: string) => {
                if (tool === "git") {
                    usingGitTool = true;
                }
                return new ToolRunner(tool);
            });

            const argStub = sandbox.stub(ToolRunner.prototype, "arg").callsFake((arg: string) => {
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

            const execStub = sandbox.stub(ToolRunner.prototype, "exec");

            // act
            task.gitPushMirror();

            // assert
            expect(getSourceGitFolderStub.called).to.be.true;
            expect(getAuthenticatedGitUriStub.called).to.be.true;
            expect(usingGitTool).to.be.true;
            expect(isCOptionUsed).to.be.true;
            expect(isSourceFolderUsed).to.be.true;
            expect(isPushUsed).to.be.true;
            expect(isMirrorOptionUsed).to.be.true;
            expect(isAuthenticatedUriUsed).to.be.true;
            expect(execStub.called).to.be.true;
            
            // cleanup
            getSourceGitFolderStub.restore();
            getAuthenticatedGitUriStub.restore();
            toolStub.restore();
            argStub.restore();
            execStub.restore();
        });
    });

    describe("getSourceGitFolder", () => {
        it("should fail if the given URI is undefined", () => {
            // arrange
            const sourceGitUri = undefined;
            let isErrorThrown = false;
            
            const task = new GitMirrorTask();
            
            // act
            try {
                const folder = task.getSourceGitFolder(sourceGitUri);
            }
            catch (e) {
                isErrorThrown = true;
            }
            // assert
            expect(isErrorThrown).to.be.true;
        });

        it("should fail if the given URI is not a valid URI", () => {
            // arrange
            const sourceGitUri = "invalidUri";
            let isErrorThrown = false;
            
            const task = new GitMirrorTask();
            
            // act
            try {
                const folder = task.getSourceGitFolder(sourceGitUri);
            }
            catch (e) {
                isErrorThrown = true;
            }
            // assert
            expect(isErrorThrown).to.be.true;
        });

        it("should extract a folder name from a given uri", () => {
            // arrange
            const sourceGitUri = "https://github.com/traviskosarek/traviskosarek-com";
            let isErrorThrown = false;
            
            const task = new GitMirrorTask();
            let folder;

            // act
            try {
                folder = task.getSourceGitFolder(sourceGitUri);
            }
            catch (e) {
                isErrorThrown = true;
            }
            // assert
            expect(isErrorThrown).to.be.false;
            expect(folder).to.be.equal("traviskosarek-com.git");
        });
    });

    describe("getAuthenticatedGitUri", () => {
        it("should fail if the given URI is undefined", () => {
            // arrange
            const uri = undefined;
            const token = "token";
            let isErrorThrown = false;
            let authenticatedUri;
            
            const task = new GitMirrorTask();
            
            // act
            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }
            // assert
            expect(isErrorThrown).to.be.true;
        });

        it("should fail if the given URI is not a valid URI", () => {
            // arrange
            const uri = "invalidUri";
            const token = "token";
            let isErrorThrown = false;
            let authenticatedUri;
            
            const task = new GitMirrorTask();
            
            // act
            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }
            // assert
            expect(isErrorThrown).to.be.true;
        });

        it("should return URI if no token is specified", () => {
            // arrange
            const uri = "https://github.com/traviskosarek/traviskosarek-com";
            const token = undefined;
            let isErrorThrown = false;
            let authenticatedUri;

            const task = new GitMirrorTask();

            // act
            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }
            
            // assert
            expect(isErrorThrown).to.be.false;
            expect(authenticatedUri).to.be.equal(uri);
        });

        it("should return a uri with the PAT token injected given the uri contains a http protocol", () => {
            // arrange
            const uri = "http://github.com/traviskosarek/traviskosarek-com";
            const token = "token";
            let isErrorThrown = false;
            let authenticatedUri;

            const task = new GitMirrorTask();

            // act
            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }
            
            // assert
            expect(isErrorThrown).to.be.false;
            expect(authenticatedUri).to.be.equal("http://" + token + "@" + "github.com/traviskosarek/traviskosarek-com");
        });

        it("should return a uri with the PAT token injected given the uri contains a https protocol", () => {
            // arrange
            const uri = "https://github.com/traviskosarek/traviskosarek-com";
            const token = "token";
            let isErrorThrown = false;
            let authenticatedUri;

            const task = new GitMirrorTask();

            // act
            try {
                authenticatedUri = task.getAuthenticatedGitUri(uri, token);
            }
            catch (e) {
                isErrorThrown = true;
            }
            
            // assert
            expect(isErrorThrown).to.be.false;
            expect(authenticatedUri).to.be.equal("https://" + token + "@" + "github.com/traviskosarek/traviskosarek-com");
        });
    });
});
