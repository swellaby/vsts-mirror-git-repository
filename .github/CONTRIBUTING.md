# Contributing
All contributions are welcomed!

## Opening Issues
Click the below quick links to create a new issue:

- [Report a bug][create-bug-url]
- [Request an enhancement][create-enhancement-url]
- [Ask a question][create-question-url]

## Developing
All that is needed to work with this repo is [Node.js][nodejs-url] and your favorite editor or IDE, although we recommend [VS Code][vscode-url].

### Building
To build and/or work on this project:

Clone the repo, change into the directory where you cloned the directory, and then run the developer setup script
```sh     
git clone https://github.com/swellaby/vsts-mirror-git-repository.git
cd vsts-mirror-git-repository 
npm i
npm run dev-test
```

### Submitting changes
Swellaby members should create a branch within the repository, make changes there, and then submit a PR. 

Outside contributors should fork the repository, make changes in the fork, and then submit a PR.

### Tests
We use [Mocha][mocha-url] and [Sinon][sinon-url] to test and validate, and the tests are written using [Mocha's BDD interface][mocha-bdd-url].  

There are suites of unit tests that validate individual functions in complete isolation. Unit tests reside in the `src` directory hierarchy in `*.spec` files alongside the application code files that they test.

The tests can be run via the npm `test` and `dev-test` scripts. The test results will be displayed in the console.

Run the unit tests:
```sh
npm test
or
npm run dev-test
``` 

You must write corresponding unit tests for any code you add or modify, and all tests must pass before those changes can be merged back to the master branch.

### Code coverage
Code coverage is generated, and enforced using [Istanbuljs/nyc][nyc-url]. The unit test suite has 100% coverage of the application source code. Code coverage will not be allowed to dip below 100%.

Code coverage results will be displayed on the terminal when the unit tests are run.

### Linting
This repo uses [tslint][tslint-url] for linting the source code. tslint is executed by running the npm `lint` script. The tslint configuration file can be found in the [tslint.json][tslint-config-url] file.

You can run [tslint][tslint-url] at any time by executing the npm `lint` script:

```sh
npm run lint
```  

 [Back to Top][top]

[create-bug-url]: https://github.com/swellaby/vsts-mirror-git-repository/issues/new?template=BUG_TEMPLATE.md&labels=bug,unreviewed&title=Bug:%20
[create-question-url]: https://github.com/swellaby/vsts-mirror-git-repository/issues/new?template=QUESTION_TEMPLATE.md&labels=question,unreviewed&title=Q:%20
[create-enhancement-url]: https://github.com/swellaby/vsts-mirror-git-repository/issues/new?template=ENHANCEMENT_TEMPLATE.md&labels=enhancement,unreviewed
[nodejs-url]:https://nodejs.org/en/download/
[vscode-url]: https://code.visualstudio.com/
[tslint-url]: https://palantir.github.io/tslint/
[tslint-config-url]: ../tslint.json
[mocha-url]: https://mochajs.org/
[mocha-bdd-url]: https://mochajs.org/#bdd
[sinon-url]: sinonjs.org/
[nyc-url]: https://istanbul.js.org/
[top]: #contributing
