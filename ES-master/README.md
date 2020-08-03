# Sections
1. [Git cheat sheet](https://gitlab.com/nunomota/software-engineering-2016#1-git-cheat-sheet)
2. [Branching conventions](https://gitlab.com/nunomota/software-engineering-2016#2-branching-conventions)
3. [Code conventions](https://gitlab.com/nunomota/software-engineering-2016#3-code-conventions)

## 1. Git Cheat Sheet
- `git branch branch_name` (to create a new branch named **branch_name**).
- `git checkout branch_name` (to navigate to the branch you want).
- `git pull origin branch_name` (to get updates from the repository).
- `git status` (to check which files have been changed)
- `git add folder/file.txt` or `git add -A` (to add files you changed to the staging area).
- `git commit -m "Adds title to file.txt"` (to commit all the files you added, with a message).
- `git push origin branch_name` (to upload all of your changes to the repository).

## 2. Branching Conventions
- Branching lifecycle:
    1. Whenever you are working on a different feature, or simply extending an existing one, **create a new branch**.
    2. **Don't code different features on the same branch**, keep every branch as modular and simple as possible.
    3. As soon as a feature is fully implemented, **open a merge request and wait for other team memebers to comment**.
    4. After getting all the necessary fixes in place, **merge your branch and fix any conflicts**.
    5. Do it all over again.
- Branch naming:
    - Always use one of three keywors as the prefix for any branch name: `core`, `extra` or `experimental`.
    - Every word contained in a branch's name should be separated with an underscore, like `core_branch`.
    - All the letters in a branch's name should be lower case.
    - The name of a branch should let everyone know what is being done in there.
    - **Valid branch names**: `core_file_explorer`; `extra_folder_icons`; `experimental_gitlab_java_interface`.
    - **Invalid branch names**: `something_without_prefix`; `core_GitLab_upper_case`; `extra_something_that_makes_no_sense`.

## 3. Code Conventions
- As a matter of simplicity, we are going to follow [Oracle's Java code conventions](http://www.oracle.com/technetwork/java/codeconvtoc-136057.html) for Java:
    1. [File Names](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-137760.html#16732)
    2. [File Organization](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-141855.html#3043)
    3. [Identation](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-136091.html#262)
    4. [Comments](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-141999.html#385)
    5. [Declarations](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-141270.html#2991)
    6. [Statements](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-142311.html#430)
    7. [White Space](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-141388.html#475)
    8. [Naming Conventions](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-135099.html#367)
    9. [Programming Practices](http://www.oracle.com/technetwork/java/javase/documentation/codeconventions-137265.html#529)
- On the same topic, we'll be using [w3schools](http://www.w3schools.com/)' conventions for both [JavaScript](http://www.w3schools.com/js/js_conventions.asp) and [HTML](http://www.w3schools.com/html/html5_syntax.asp).