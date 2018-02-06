# Mirror Git Repository

![Mirror Git Repository Logo][logo-image]

[![Version Badge][marketplace-version-badge]][extension-marketplace-url]
[![Installs Badge][marketplace-installs-badge]][extension-marketplace-url]
[![Rating Badge][marketplace-rating-badge]][extension-marketplace-url]

[![License Badge][license-badge]][repo-url]

## Overview

The purpose of the Mirror Git Repository task is to facilitate the copying of changes of one Git Repository to another.

## Task Configuration

The process of mirroring a Git repository consists of two basic steps:

1. Clone a source repository
2. Push that repository to another location

Both of these steps may require additional access in order to read or write to the relevant repositories. In order to provide that access, Personal Access Tokens (PATs) are used to grant the build agent the access it needs to perform these actions.

**Source Git Repository**
The HTTPS endpoint of the Git Repository you want to copy from. This field is **required**. The default value of this field `$(Build.Repository.Uri)` will populate the field with the source repository the build is linked to.

**Source Repository - Personal Access Token**
A Personal Access Token (PAT) that grants read access to the repository in the `Source Git Repository` field. This field is **optional**. If the Git repository in the `Source Git Repository` field is public, this field does not need to be populated. Check out the **Best Practices** section below for more details on managing PAT Tokens securely.

**Destination Git Repository**
The HTTPS endpoint of the Git Repository you want to copy to. This field is **required**.

**Destination Repository - Personal Access Token**
A Personal Access Token (PAT) that grants write access to the repository in the `Destination Git Repository` field. This field is **required**. Check out the **Best Practices** section below for more details on managing PAT Tokens securely.

<br/>

## Best Practices

### Generating Personal Access Tokens

In order to use this task, you will need to create Personal Access Tokens to the appropriate repositories. Below are some links on how to achieve this:

- [How to create a Personal Access Token on Github][github-pat-token-url]
- [How to create a Personal Access Token on VSTS][vsts-pat-token-url]

### Securing Personal Access Tokens during the build

While you have the ability to enter the PAT tokens into the task in plain-text, it is best practice to mask these tokens so that your repositories remain secure. VSTS supports the ability to manage and inject secure variables at build time. There are currently two ways to achieve this in VSTS:

1. [Use a Secret Process Variable directly on the build definition][vsts-secret-variables]
2. [Use a Secret variable from a Variable Group linked to the build definition][vsts-secret-variable-group]

By using secret variables in your build task, your PAT tokens will be masked in any build output.

<br/>

## Frequently Asked Questions

### Can I use this task to mirror to other Git Source Control Platforms?

&nbsp;&nbsp;&nbsp;&nbsp;_**tl;dr** Yes, it should work with any Git repository._

This task is built solely on top of [Git][git-url] commands. As long as the build agent has read access to the source repository and write access to the destination repository, the endpoints are not specific to any Git Source Control Platform.

### Why should I choose this task over one of the other Git mirroring tasks available on the marketplace?

&nbsp;&nbsp;&nbsp;&nbsp;_**tl;dr** It is the only mirroring task that currently works without needing to modify the VSTS Build Agent Docker Image to include Powershell_

As of this task being published, the other tasks on the Marketplace that perform similar actions are written with Powershell scripts and do not work out-of-the-box with the [VSTS Build Agent Docker Image][docker-vsts-agent-url]. To fill this gap, we decided to develop our own task that is written in [NodeJS][nodejs-url]. *Note that this task does require the build agent to have [NodeJS][nodejs-url] installed.*

### Does the task create a Destination Git Repository if it doesnt exist?

&nbsp;&nbsp;&nbsp;&nbsp;_**tl;dr** No._

The Destination Git Repository must exist before it can be pushed to.

### But what is the task _really_ doing under the hood?

&nbsp;&nbsp;&nbsp;&nbsp;_**tl;dr** Check out our [Github repo][repo-url]_

The task is using basic git commands to mirror the repository. If you would like more details on what commands are being ran, you can find the details at this Github reference page: [Mirror a Repository in Another Location][mirror-instructions-url]

If you would like to see the code directly, feel free to browse our [Github repo][repo-url]

### Help! The task seems to hang and won't continue!

&nbsp;&nbsp;&nbsp;&nbsp;_**tl;dr** Check your variables, check your access._

It is highly likely that the cause of a hanging issue is that the build agent is not able to access the Git Repository URL you provided. If you were executing the Git commands manually, this would be seen by Git prompting for credentials. This prompt will not show within the build output. 

Some things to check if you are experiencing this issue:

1. Check that both of the Git Repository URLs you provided are correct.
2. You may need to include a Personal Access Token to give the build agent access to the Git Repository.

&nbsp;&nbsp;&nbsp;&nbsp;_Note: The task does not give the build agent read or write access to your VSTS repositories by default._

### I have other questions and/or need to report an issue

Please report any issues to our [Github Issues page][repo-issues-url].

Feel free to leave a question or a comment on our [Github repo][repo-url] or on the [VSTS Task in the Marketplace][extension-marketplace-url].

<br/>

## Generator

Want to make your own VSTS Task? This task was initially created by this [swell generator][parent-generator-url]!

<br/>

## Icon Credits

The Git logo is the orginal property of [Jason Long][jason-long-twitter-url] and is used/modified under the [Creative Commons Attribution 3.0 Unported License][cc3-license-url]. Thank you Jason for allowing us to modify your logo!

[cc3-license-url]: https://creativecommons.org/licenses/by/3.0/
[docker-vsts-agent-url]: https://hub.docker.com/r/microsoft/vsts-agent/
[extension-marketplace-url]: https://marketplace.visualstudio.com/items?itemName=swellaby.mirror-git-repository
[github-pat-token-url]: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/#creating-a-token
[git-url]: https://git-scm.com/
[jason-long-twitter-url]: https://twitter.com/jasonlong
[license-badge]: https://img.shields.io/github/license/swellaby/mirror-git-repository.svg
[logo-image]: images/extension-icon.png
[marketplace-version-badge]: https://vsmarketplacebadge.apphb.com/version-short/swellaby.mirror-git-repository.svg
[marketplace-installs-badge]: https://vsmarketplacebadge.apphb.com/installs/swellaby.mirror-git-repository.svg
[marketplace-rating-badge]: https://vsmarketplacebadge.apphb.com/rating/swellaby.mirror-git-repository.svg
[mirror-instructions-url]: https://help.github.com/articles/duplicating-a-repository/#mirroring-a-repository-in-another-location
[nodejs-url]: https://nodejs.org
[parent-generator-url]: https://github.com/swellaby/generator-swell
[repo-issues-url]: https://github.com/swellaby/vsts-mirror-git-repository/issues
[repo-url]: https://github.com/swellaby/vsts-mirror-git-repository
[vsts-pat-token-url]: https://docs.microsoft.com/en-us/vsts/accounts/use-personal-access-tokens-to-authenticate#create-personal-access-tokens-to-authenticate-access
[vsts-secret-variables]: https://docs.microsoft.com/en-us/vsts/build-release/concepts/definitions/build/variables?tabs=batch#secret-variables
[vsts-secret-variable-group]: https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/variable-groups
