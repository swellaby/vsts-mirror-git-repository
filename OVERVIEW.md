# Mirror Git Repository

![logo][logo-image]

[![Version Badge][marketplace-version-badge]][ext-marketplace-url] 
[![Installs Badge][marketplace-installs-badge]][ext-marketplace-url]
[![Rating Badge][marketplace-rating-badge]][ext-marketplace-url]

[![License Badge][license-badge]][repo-url]

## Overview

The purpose of the Mirror Git Repository task is to facilitate the copying of changes of one Git Repository to another.

_Example Use Case:_ You want to manage code in a VSTS repository but also want a copy of that code to appear on Github so it is publicly viewable.

## Task Configuration

The IP Address Scanner has a few key inputs that you'll need to plug your respective values into. 

- *VSTS Account Name*  -   
The name of your VSTS account. If you are not sure of your account name, look at the part before `.visualstudio.com/...` in the url. For example, `https://fabrikam.visualstudio.com/...` the account name would be `fabrikam`
- *Personal Access Token* -  
This is the token the scanner will use to communicate with your VSTS account. This should be the token of a member of the Collection Administrators group, and we highly recommend you use a [definition variable] to store the value. If you've got more than one VSTS account you will be scanning then we also recommend giving your token access to all your accounts. See the [below section][access-token-section] for more information about this variable, and the [PAT documentation][pat-url] for information on creating Tokens.

Below is a sample configuration screenshot with random data.
![Example Task Configuration][config-task-image]  


You will need to use a Personal Access Token to get write access to whatever Destination Git Repository you want to push to.

[How to create a Personal Access Token on Github](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/#creating-a-token)

[How to create a Personal Access Token on VSTS](https://docs.microsoft.com/en-us/vsts/accounts/use-personal-access-tokens-to-authenticate#create-personal-access-tokens-to-authenticate-access)

<br/>

## Frequently Asked Questions

#### Can I use this task to mirror to other Git Source Control Platforms?

_**tl;dr** Yes, it should work with any Git repository._

This task is built solely on top of [Git](https://git-scm.com/) commands. As long as the build agent has read access to the source repository and write access to the destination repository, the endpoints are not specific to any Git Source Control Platform.

#### Why should I choose this task over one of the other Git mirroring tasks available on the marketplace?

_**tl;dr** It works without modifying the out-of-the-box VSTS Build Agent Docker Image_

As of this task being published, the other tasks on the Marketplace that perform similar actions are written with Powershell scripts and do not work out-of-the-box with the [VSTS Build Agent Docker Image](https://hub.docker.com/r/microsoft/vsts-agent/). To fill this gap, we decided to develop our own task that is written in [NodeJS](https://nodejs.org). *Note that this task does require the build agent to have [NodeJS](https://nodejs.org) installed.*

#### Does the task create a Destination Git Repository if it doesnt exist?

_**tl;dr** No._

The Destination Git Repository must exist before it can be pushed to.

#### But what is the task _really_ doing under the hood?

_**tl;dr** Go to our [Github page]()_

The task is using basic git commands to mirror the repository. If you would like more details on what commands are being ran, you can find the details at this Github page: [Mirror a Repository in Another Location](https://help.github.com/articles/duplicating-a-repository/#mirroring-a-repository-in-another-location)

If you would like to see the code directly, feel free to browse our [Github page]()

#### Help! The task seems to hang and won't continue!

_**tl;dr** Check your variables, check your access._

It is highly likely that the cause of a hanging issue is that the build agent is not able to access the Source Git Repository URL. Some things to check:

1. The Source Git Repository URL is correct.
2. You may need to include a Personal Access Token to give the build agent access to the Source Git Repository data.

_Note: The task does not give the build agent read or write access to your VSTS repositories by default._

#### I have other questions and/or need to report an issue

Please report any issues to our [Github Issues page]().

Feel free to leave a question or a comment on our [Github page]() or on the [VSTS Task in the Marketplace](). 

<br/>

## Generator
Want to make your own VSTS Task? This task was initially created by this [swell generator][parent-generator-url]!

<br/>

## Icon Credits
The Git logo is the orginal property of [Jason Long](https://twitter.com/jasonlong) and is used/modified under the [Creative Commons Attribution 3.0 Unported License](https://creativecommons.org/licenses/by/3.0/). Thank you Jason for allowing us to modify your logo!


[parent-generator-url]: https://github.com/swellaby/generator-swell
[vsts-task-icons]: docs/images/icons
[task-config-section]: VSTS-TASK.md#task-configuration
[overview-section]: VSTS-TASK.md#overview
[results-guidance-section]: VSTS-TASK.md#scan-results-and-guidance
[usage-section]: VSTS-TASK.md#usage
[background-section]: VSTS-TASK.md#task-background
[disclaimer-section]: VSTS-TASK.md#disclaimer
[access-token-section]: VSTS-TASK.md#access-token-input-additional-info
[usage-tips-section]: VSTS-TASK.md#usage-tips
[icon-author-url]: http://www.freepik.com
[flaticon-url]: http://www.flaticon.com
[cc3-url]: http://creativecommons.org/licenses/by/3.0
[logo-image]: src/git-mirror/extension-icon.png
[task-add-image]: images/definition-task-add.png
[config-task-image]: images/config-task.png
[scan-passed-image]: images/scan-passed.png
[scan-fail-image]: images/scan-fail.png
[scan-fail-wrapped-image]: images/scan-fail-wrapped.png
[travis-ci-build-status-badge]: https://travis-ci.org/swellaby/vsts-traffic-monitor.svg?branch=master
[travis-ci-url]: https://travis-ci.org/swellaby/vsts-traffic-monitor
[travis-ci-logo]: images/TravisCI-Mascot-2.png
[coveralls-badge]: https://coveralls.io/repos/github/swellaby/vsts-traffic-monitor/badge.svg
[coveralls-url]: https://coveralls.io/github/swellaby/vsts-traffic-monitor
[sonar-quality-gate-badge]: https://sonarcloud.io/api/badges/gate?key=swellaby:vsts-traffic-monitor
[sonar-url]: https://sonarcloud.io/dashboard/index/swellaby:vsts-traffic-monitor
[ext-marketplace-url]: https://marketplace.visualstudio.com/items?itemName=swellaby.ip-address-scanner
[marketplace-version-badge]: https://vsmarketplacebadge.apphb.com/version-short/swellaby.ip-address-scanner.svg
[marketplace-installs-badge]: https://vsmarketplacebadge.apphb.com/installs/swellaby.ip-address-scanner.svg
[marketplace-rating-badge]: https://vsmarketplacebadge.apphb.com/rating/swellaby.ip-address-scanner.svg
[repo-url]: https://github.com/swellaby/vsts-traffic-monitor
[license-badge]: https://img.shields.io/github/license/swellaby/vsts-traffic-monitor.svg
[definition-variables-doc-url]: https://docs.microsoft.com/en-us/vsts/build-release/concepts/definitions/build/variables?tabs=batch#user-defined-variables
[pat-url]: https://docs.microsoft.com/en-us/vsts/integrate/get-started/authentication/pats#create-personal-access-tokens-to-authenticate-access
[variable-groups-doc-url]: https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/variable-groups
[tfx-url]: https://github.com/Microsoft/tfs-cli
[vsts-azure-ad-doc-url]: https://docs.microsoft.com/en-us/vsts/accounts/connect-account-to-aad
[msa-doc-url]: https://account.microsoft.com/account
[github-ref-url]: https://github.com/swellaby/vsts-traffic-monitor/blob/master/docs/VSTS-TASK.md