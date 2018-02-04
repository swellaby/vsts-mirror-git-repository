import "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
const sinonStubPromise = require("sinon-stub-promise");
sinonStubPromise(sinon);

import * as taskLib from "vsts-task-lib";

import { GitMirrorTask } from "./git-mirror-task";

let sourceUri;
let sourcePAT;
let destinationUri;
let destinationPAT;
let getInputStub;

const buildAgentVariable = "agent.name";

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

            const getVariableStub = sandbox.stub(taskLib, "getVariable").callsFake((name: string) => {
                if (name === buildAgentVariable) {
                    return "buildAgentVariable";
                }
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
            getVariableStub.restore();
            setResultStub.restore();
        });

        it("should fail the task if the source Git repository uri is undefined", () => {
            // arrange
            sourceUri = undefined;
            let taskSucceeded = true;

            const getVariableStub = sandbox.stub(taskLib, "getVariable").callsFake((name: string) => {
                if (name === buildAgentVariable) {
                    return "buildAgentVariable";
                }
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
            getVariableStub.restore();
            setResultStub.restore();
        });

        it("should allow an undefined value for the source Git repository PAT", () => {
            // arrange
            sourcePAT = undefined;
            let taskSucceeded = true;

            const getVariableStub = sandbox.stub(taskLib, "getVariable").callsFake((name: string) => {
                if (name === buildAgentVariable) {
                    return "buildAgentVariable";
                }
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
            getVariableStub.restore();
            setResultStub.restore();
        });

        it("should fail the task if the destination Git repository uri is undefined", () => {
            // arrange
            destinationUri = undefined;
            let taskSucceeded = true;

            const getVariableStub = sandbox.stub(taskLib, "getVariable").callsFake((name: string) => {
                if (name === buildAgentVariable) {
                    return "buildAgentVariable";
                }
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
            getVariableStub.restore();
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

            const getVariableStub = sandbox.stub(taskLib, "getVariable").callsFake((name: string) => {
                if (name === buildAgentVariable) {
                    return "buildAgentVariable";
                }
            });

            // act
            const task = new GitMirrorTask();

            // assert
            expect(taskSucceeded).to.be.false;

            // cleanup
            getVariableStub.restore();
            setResultStub.restore();
        });
    });

    describe("run", () => {
        it("should verify that the Git tool is installed on the build agent", () => {
            // arrange
            let gitToolExists = false;
            let throwErrorIfGitDoesNotExist = false;

            const getVariableStub = sandbox.stub(taskLib, "getVariable").callsFake((name: string) => {
                if (name === buildAgentVariable) {
                    return "buildAgentVariable";
                }
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
            getVariableStub.restore();
            whichStub.restore();
            gitCloneMirrorStub.restore();
            gitPushMirrorStub.restore();
        });
        
        it("should fail the task if the Git tool is not installed on the build agent", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
        
        it("should fail the task if the source Git repository uri is not defined", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
        
        it("should fail the task if the destination Git repository uri is not defined", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
        
        it("should fail the task if the destination Git repository PAT is not defined", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
        
        it("should attempt to perform a 'git clone --mirror ...' command from the source repository", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
        
        it("should fail the task if the 'git clone --mirror ...' command throws an error", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });

        it("should attempt to perform a 'git push --mirror ...' command from the source repository", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });

        it("should fail the task if the 'git push --mirror ...' command throws an error", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
    });

    describe("gitCloneMirror", () => {
        it("should construct and execute a 'git clone --mirror ...' task", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
    });

    describe("gitPushMirror", () => {
        it("should construct and execute a 'git push --mirror ...' task", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
    });

    describe("getSourceGitFolder", () => {
        it("should extract a folder name from a given uri", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
    });

    describe("getAuthenticatedGitUri", () => {
        it("should return given uri if no PAT token is available", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
        it("should return a uri with the PAT token injected given the uri contains a http protocol", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
        it("should return a uri with the PAT token injected given the uri contains a https protocol", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
        it("should return a uri combined with the PAT token when a recognized protocol is not present", () => {
            // expect(-1).to.equal([1, 2, 3].indexOf(4));
        });
    });
});
