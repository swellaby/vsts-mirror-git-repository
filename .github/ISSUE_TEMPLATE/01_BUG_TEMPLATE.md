---
name:  🐞 Bug Report
about: Report errors and problems

---

## Environment Details
<!-- Fill in the below form so that we have the relevant details about the environment where the bug/error is occurring. -->
* **Pipeline**
    <!-- Check the box to specify whether you are running the Mirror Git Repository task in a Build and/or Release Pipeline. -->
  * [ ] Build
  * [ ] Release
* **Agent Type**
    <!-- Check the box to specify whether you are seeing the error on a Microsoft-hosted agent and/or a private, self-hosted agent. -->
  * [ ] Hosted Agent
  * [ ] Self-hosted/private Agent
* **Agent OS**
    <!-- Check the box to specify which operating system(s) the are used by the agents where you are seeing the error. -->
  * [ ] Linux
  * [ ] Mac
  * [ ] Windows
* **Agent Tool Versions**
    <!-- Add the versions of the below items on the agent where you are seeing the bug. You may include multiple values (i.e. Node 8.x, 9.x) if you are seeing the error on multiple versions. -->
  * **Node.js Version**: 
  * **npm version**:
  * **git version**:

<!-- Fill out the below information based on how you are configuring/using the Git Mirror Task. -->
* **Mirror Task Configuration**
  * **Mirror Git Repo Task version**:
  * **Mirror Source Repo System**
    * [ ] GitHub
    * [ ] GitHub Enterprise
    * [ ] Azure DevOps (formerly VSTS)
    * [ ] Azure DevOps Server (formerly TFS)
    * [ ] Bitbucket Cloud
    * [ ] Bitbucket Server
    * [ ] Gitlab.com
    * [ ] Gitlab Self-Hosted
    * [ ] AWS CodeCommit
    * [ ] GCP Cloud Source Repositories
    * [ ] Other (please specify):  
  * [ ] Using PAT for Mirror Source Repo
  * [ ] Mirror Source Repo is Public
  * [ ] Using SSL Verification on Mirror Source Repo
  * **Mirror Destination Repo System**
    * [ ] GitHub
    * [ ] GitHub Enterprise
    * [ ] Azure DevOps (formerly VSTS)
    * [ ] Azure DevOps Server (formerly TFS)
    * [ ] Bitbucket Cloud
    * [ ] Bitbucket Server
    * [ ] Gitlab.com
    * [ ] Gitlab Self-Hosted
    * [ ] AWS CodeCommit
    * [ ] GCP Cloud Source Repositories
    * [ ] Other (please specify):  
  * [ ] Using PAT for Mirror Destination Repo
  * [ ] Mirror Destination Repo is Public
  * [ ] Using SSL Verification on Mirror Destination Repo
  

## Description
<!-- Provide a clear and concise description of the bug/problem you are experiencing. -->

## Log Output
<!-- Provide the log output of the Mirror Git Repository task from your pipeline where the task is failing. Below is an example of what that will look like:

2018-12-04T23:30:15.1091356Z ##[section]Starting: Mirror Git Repository
2018-12-04T23:30:15.1094369Z ==============================================================================
2018-12-04T23:30:15.1094484Z Task         : Mirror Git Repository
2018-12-04T23:30:15.1094525Z Description  : A straightforward utility to mirror one Git repository to another location
2018-12-04T23:30:15.1094713Z Version      : 1.1.7
2018-12-04T23:30:15.1094811Z Author       : Swellaby
2018-12-04T23:30:15.1094852Z Help         : [More Information](https://github.com/swellaby/vsts-mirror-git-repository)
2018-12-04T23:30:15.1095054Z ==============================================================================
2018-12-04T23:30:17.0702892Z [command]/usr/bin/git -c http.sslVerify=false clone --mirror https://null@github.com/swellaby/vsts-mirror-git-repository.git
2018-12-04T23:30:17.0874432Z Cloning into bare repository 'vsts-mirror-git-repository.git'...
2018-12-04T23:30:18.1829560Z [command]/usr/bin/git -c http.sslVerify=true -C vsts-mirror-git-repository.git push --mirror https://***@dev.azure.com/swellaby/OpenSource/_git/mirror2
2018-12-04T23:30:19.5089488Z To https://dev.azure.com/swellaby/OpenSource/_git/mirror2
2018-12-04T23:30:19.5091217Z  - [deleted]         develop
2018-12-04T23:30:19.5092078Z  + 1a218ce...2de2a13 master -> master (forced update)
2018-12-04T23:30:19.5371849Z ##[section]Finishing: Mirror Git Repository

-->