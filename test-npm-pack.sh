#!/bin/bash

# USAGE: test-npm-pack [num-tests]
# (run from the top of your git repository)

# There are sometimes problems with npm-publish (missing files etc.),
# so be sure to test the build!
# https://github.com/npm/npm/issues/5082


# Change the package version before running this script,
# e.g., `npm version patch`.

GIT_DIR=`pwd`


# 0. Require a clean repository.

if [[ -n `git status -s -uno` ]]; then
  echo "Please stash your changes before running."
  exit 1
fi


function make_build {

  # 1. Make a temporary directory for doing our work.

  REV=`git rev-list master -1`
  BUILD_DIR=`mktemp -d --tmpdir npm-publish-safely.$REV.XXXXXX`
  echo "Building in directory: $BUILD_DIR"


  # 2. Create a list of build files from the repository.

  GIT_LS=$BUILD_DIR/git-ls.txt
  NPM_IGNORE=$BUILD_DIR/npmignore.txt
  GIT_LIST=$BUILD_DIR/git-files.txt

  git ls-files | sort > $GIT_LS
  if [[ -f .npmignore ]]; then
    # .npmignore info: https://docs.npmjs.com/misc/developers (2015-01-01)
    git ls-files -i -X .npmignore | sort > $NPM_IGNORE
    diff $NPM_IGNORE $GIT_LS | awk '$1 == ">" && $2 !~ /^(node_modules\/|.gitignore$)/ { print $2 }' > $GIT_LIST
  else
    mv $GIT_LS $GIT_LIST
  fi


  # 3.pre. Clean the npm cache.
  # PKG_MOD_NAME=`awk '/^[ \t]*"name":/ { FS="\""; $0=$0; print $4; exit }' $GIT_DIR/package.json`
  # npm cache clean $PKG_MOD_NAME


  # 3. Build the package with npm.

  cd $BUILD_DIR
  PKG_FILENAME=`npm pack $GIT_DIR`


  # 4. Get the list of files that got packaged by npm.

  PKG_FILE=$BUILD_DIR/$PKG_FILENAME
  PKG_LIST=$PKG_FILE.list
  tar tf $PKG_FILE | sed -e 's/^[^/]\+\///' | sort > $PKG_LIST


  # 5. Compare the file lists.

  DIFF=`diff $PKG_LIST $GIT_LIST | grep -e '^>'`
  if [[ -n "$DIFF" ]]; then
    echo "ERRORS IN npm pack:"
    echo "$DIFF"
    exit 1
  fi

  cd $GIT_DIR
  rm -r $BUILD_DIR
}


NUM_ITERS=10
if [[ -n $1 ]]; then
  NUM_ITERS=$1
fi
echo "Number of iterations being attempted: $NUM_ITERS"

ITERATION=0
while [ $ITERATION -lt $NUM_ITERS ]; do
  let ITERATION=ITERATION+1
  echo "Starting iteration $ITERATION..."
  make_build
done