# Contributing to the project
## How to contribute
Contributions are welcome and will be fully credited. We accept contributions via Pull Requests on [Github](
    https://github.com/Aadesh-Baral/OSMLocalizer). Please review these guidelines before submitting any pull requests.
### Pull Requests
- **Document any change in behaviour** - Make sure the README and any other relevant documentation are kept up-to-date.
- **Create feature branches** - Make sure you create feature branches and
  update your rebase before submitting your pull request.
- **One pull request per feature** - If you want to do more than one thing, send multiple pull requests.
- **Send coherent history** - Make sure each individual commit in your pull request is meaningful. If you had to make
  multiple intermediate commits while developing, please squash them before submitting.
### Coding Standards
- Stick to pep8 python style guide for the backend and format your code using `black` and `flake8`.
- Use [Numpy docstrings style](https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_numpy.html#example-numpy) to document your code.
- Apply ESLint and prettier style guide rules for the frontend code. Format your frontend code using prettier `yarn run
  prettier`.
- Write tests for any new functions or methods you introduce. Make sure the tests pass before submitting your pull request. You can run the tests using `python -m unittest discover` and measure the code coverage using `coverage run -m unittest discover && coverage report`.
- Write tests for any new components you introduce in the frontend. Make sure the tests pass before submitting your pull request. You can run the tests using `yarn run test`.
- Write meaningful commit messages. If you had to make multiple commits while developing, please squash them before submitting.
