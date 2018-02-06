# Mirror Git Repository

![Mirror Git Repository Logo][logo-image]

[![Version Badge][marketplace-version-badge]][extension-marketplace-url]
[![Installs Badge][marketplace-installs-badge]][extension-marketplace-url]
[![Rating Badge][marketplace-rating-badge]][extension-marketplace-url]

[![License Badge][license-badge]][repo-url]

## Overview

The purpose of the Mirror Git Repository task is to facilitate the copying of changes of one Git Repository to another.

_Example Use Case:_ You want to manage code in a VSTS repository but also want a copy of that code to appear on Github so it is publicly viewable.

## Task Configuration

The IP Address Scanner has a few key inputs that you'll need to plug your respective values into. 

- *VSTS Account Name*  -   
The name of your VSTS account. If you are not sure of your account name, look at the part before `.visualstudio.com/...` in the url. For example, `https://fabrikam.visualstudio.com/...` the account name would be `fabrikam`
- *Personal Access Token* -  
This is the token the scanner will use to communicate with your VSTS account. This should be the token of a member of the Collection Administrators group, and we highly recommend you use a [definition variable] to store the value. If you've got more than one VSTS account you will be scanning then we also recommend giving your token access to all your accounts. See the [below section]() for more information about this variable, and the [PAT documentation]() for information on creating Tokens.

Below is a sample configuration screenshot with random data.
![Example Task Configuration]()


You will need to use a Personal Access Token to get write access to whatever Destination Git Repository you want to push to.

[How to create a Personal Access Token on Github][github-pat-token-url]

[How to create a Personal Access Token on VSTS][vsts-pat-token-url]

<br/>

## Frequently Asked Questions

#### Can I use this task to mirror to other Git Source Control Platforms?

_**tl;dr** Yes, it should work with any Git repository._

This task is built solely on top of [Git][git-url] commands. As long as the build agent has read access to the source repository and write access to the destination repository, the endpoints are not specific to any Git Source Control Platform.

#### Why should I choose this task over one of the other Git mirroring tasks available on the marketplace?

_**tl;dr** It works without modifying the out-of-the-box VSTS Build Agent Docker Image_

As of this task being published, the other tasks on the Marketplace that perform similar actions are written with Powershell scripts and do not work out-of-the-box with the [VSTS Build Agent Docker Image][docker-vsts-agent-url]. To fill this gap, we decided to develop our own task that is written in [NodeJS][nodejs-url]. *Note that this task does require the build agent to have [NodeJS][nodejs-url] installed.*

#### Does the task create a Destination Git Repository if it doesnt exist?

_**tl;dr** No._

The Destination Git Repository must exist before it can be pushed to.

#### But what is the task _really_ doing under the hood?

_**tl;dr** Go to our [Github repo][repo-url]_

The task is using basic git commands to mirror the repository. If you would like more details on what commands are being ran, you can find the details at this Github page: [Mirror a Repository in Another Location][mirror-instructions-url]

If you would like to see the code directly, feel free to browse our [Github repo][repo-url]

#### Help! The task seems to hang and won't continue!

_**tl;dr** Check your variables, check your access._

It is highly likely that the cause of a hanging issue is that the build agent is not able to access the Source Git Repository URL. Some things to check:

1. The Source Git Repository URL is correct.
2. You may need to include a Personal Access Token to give the build agent access to the Source Git Repository data.

_Note: The task does not give the build agent read or write access to your VSTS repositories by default._

#### I have other questions and/or need to report an issue

Please report any issues to our [Github Issues page][repo-issues-url].

Feel free to leave a question or a comment on our [Github repo][repo-url] or on the [VSTS Task in the Marketplace][extension-marketplace-url].

<br/>

## Generator
Want to make your own VSTS Task? This task was initially created by this [swell generator][parent-generator-url]!

<br/>

## Icon Credits
The Git logo is the orginal property of [Jason Long][jason-long-twitter-url] and is used/modified under the [Creative Commons Attribution 3.0 Unported License][cc3-license-url]. Thank you Jason for allowing us to modify your logo!


[parent-generator-url]: https://github.com/swellaby/generator-swell
[logo-image]: images/extension-icon.png
[extension-marketplace-url]: https://marketplace.visualstudio.com/items?itemName=swellaby.ip-address-scanner
[marketplace-version-badge]: https://vsmarketplacebadge.apphb.com/version-short/swellaby.ip-address-scanner.svg
[marketplace-installs-badge]: https://vsmarketplacebadge.apphb.com/installs/swellaby.ip-address-scanner.svg
[marketplace-rating-badge]: https://vsmarketplacebadge.apphb.com/rating/swellaby.ip-address-scanner.svg
[mirror-instructions-url]: https://help.github.com/articles/duplicating-a-repository/#mirroring-a-repository-in-another-location
[repo-url]: https://github.com/swellaby/vsts-mirror-git-repository
[repo-issues-url]: https://github.com/swellaby/vsts-mirror-git-repository/issues
[docker-vsts-agent-url]: https://hub.docker.com/r/microsoft/vsts-agent/
[git-url]: https://git-scm.com/
[license-badge]: https://img.shields.io/github/license/swellaby/vsts-traffic-monitor.svg
[nodejs-url]: https://nodejs.org
[vsts-pat-token-url]: (https://docs.microsoft.com/en-us/vsts/accounts/use-personal-access-tokens-to-authenticate#create-personal-access-tokens-to-authenticate-access)
[github-pat-token-url]: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/#creating-a-token
[jason-long-twitter-url]: https://twitter.com/jasonlong
[cc3-license-url]: https://creativecommons.org/licenses/by/3.0/