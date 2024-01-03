# amili-dashboard

## Overview

- **[Project on a page](Link)**
- **[Goals and measures](Link)**
- **[Glossary](Link)**
- **[Supporting Documents](Link)**
- **[Presentation](Link)**

## Requirements

- **[Current journey map](Link)**
- **[Future journey map](Link)**
- **Epics ([All](Link) / [Open](Link) )**- representing a high level feature set that is typcially delivered across multiple sprints.
- **Stories ([All](Link) / [Open](Link) )** - representing specific testable user or system requirements that can usually be implemented in one sprint.

## Usage

- Instruction of devevelopment & deployment will be here

## Testing purpose

- **[All testing accounts will be here](Link)**

## Test Framework

ExtraSurveyFlowElement Behaviour Driven Develpment (BDD) model is at the heart of the testing frameork.

- **[Tests Data Management](Link)**
- **[BDD Tests Cases](Link)**

## System Operations

ExtraSurveyFlowElement highly automated continuous delivery pipeline based on the [Code On Tap](http://codeontap.io/) OR [Jenkins](https://www.jenkins.io/) is used for confident deployment of new features.

- **[DevOps Framework](Link)**
- **[System Access](Link)**

## Project Management

We use [Click Up](https://clickup.com/) for Project Management & Document Wiki

- **[Raw Issues List](Link)**
- **[Milestones](Link)**
- **[Kanban Board](Link)**

## Team

Zigvy Corp (HCMC - VN)

- Hau Nguyen - @haunguyen90 Project Manager - Take care of Clients and Delivery (HCMC, VN, GMT +7)
- Van Bui - @vanbui1995 Project Lead - Manage Tasks, Development Progress, Plans/Goal (HCMC, VN, GMT +7)
- Phat Doan - @phatdvzv Full-stack Senior Dev (HCMC, VN, GMT +7)
- Duong Phan - @pnhduongen Full-stack Senior Dev (HCMC, VN, GMT +7)
- Tung Mac - @macminhtung Full-stack Mid Dev (HCMC, VN, GMT +7)

Partners/Project Co-owner:

- Vivek Ravindran - @Vivek-amili Project Owner (Singapore, GMT +8)
- Chen Ning - @chenningg Technical & Business Manager (Singapore, GMT +8)
- Raghu Vdm - DevOps / Cloud Service Manager (Singapore, GMT +8)

## Coding Workflow

This project uses the git forking workflow, https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow
And git-flow, https://bitbucket.org/zigvy/git-flow/src/master/ or https://jeffkreeftmeijer.com/git-flow/

It's OK to leave questions hanging in slack, for someone who isn't there at the moment but will be later. So each shift should start with a review of slack, "question grooming" activity, along with the usual ticket-grooming.

Clone the repo, commit frequently, make a PR for dicussion early (and if you think it's ready to merge then say so).

Try to push to your commits at least once an hour, and write commit messages "in the imperative mood". Read this if you haven't already: http://chris.beams.io/posts/git-commit/

Each commit should do one thing. It's no problem making lots of small commits, it's actualy much better than infrequent large commit because they are easier to review.

## Github workflow

We use the Pull Request system of github.
You first need to fork the repo.

For creating a PR please follow this :

- Fetch the upstream master & develop : `git fetch upstream/master && git fetch upstream/develop`
- Switch to `develop` branch.
- Create a new clean branch : `git checkout --track -b myNewBranch upstream/develop` , a good practice is to following [git-flow](https://jeffkreeftmeijer.com/git-flow/) ( you should not use the master of your own remote ( `origin` ) as a dev branch , your master should be equal to the `upstream/master` )
- Do your work, _make commits_, you should create directly a PR and _push your work frequently_.
- If other devs push commits , you should rebase your own branch. you fetch again `git fetch upstream/develop` and `git rebase upstream/develop` ( you can also use the interactive rebase to squash your commit into one `git rebase -i upstream/develop` )
- If you have conflict , you have to resolve each conflict on each commit , do it manually or add `kdiff3` / `Beyond Compare` or anything that fit you , add these modification and do `git rebase --continue` until you cleared the conflicts.
- Test your code.
- You can now push your code , if the branch is new you just do git `push origin myNewBranch` , if you had rebase you need to force the `push git push origin myNewBranch -f`
- Create the PR , with a new branch github detect it automatically you should see a yellow bar on main page. MOST IMPORTANT, point the PR to `develop` branch
- When the PR is merged , delete you local and remote branch

**More you rebase your branch often, less you get problems. So don't wait ! You should rebase each time a commit is added to the upstream/master.**

**DISCLAIMER** : Use _`push -f`_ only with **Fork and PR project** like here, never on a project were everyone is working on the **same remote**. Your rewrite commits history.

## Build Scripts
We can easy build our frontend app by:
- Check & update ENVs for specific environmet in .env file
- Locally: .env.development, Staging: .env.staging, Production: .env.production
- Run:
```
yarn install
yarn build:developement or yarn build:staging or yarn build:production
```
- The build spa app will be in `./build` folder
- All envs in this repo:
```
# Backend URL
VITE_APP_BACKEND_API_URL=http://localhost:3001

# Main cognito region, clientId, userPoolId of Amili Staff User Tenant User Pool
VITE_APP_AWS_USER_POOL_ID=ap-southeast-1_UPaocXJke
VITE_APP_AWS_COGNITO_REGION=ap-southeast-1
VITE_APP_AWS_COGNITO_CLIENT_ID=2eih8kddhni495urbi1htaenpu

# Main domain of v2 application
VITE_APP_DOMAIN=v2.dev.bioandme.asia

# Key to use location third party api
VITE_APP_X_CSCAPI_KEY=RmhEeU9CMUh1SVg0S0w4QWpxbjljZUQ0SUMxdHJZdGNXRTBkUktQcw==

# S3 URL for public resource
VITE_APP_S3_URL=https://amili-dev.s3-ap-southeast-1.amazonaws.com

# Public key of Stripe
VITE_APP_STRIPE_PUBLIC_KEY=pk_test_51IiwkWIRc3uYlxRVIjluLELhsJehh62Ee7rGfjRer46Jg2OF2TdPK6Cdg9yD9Qo0hyg8MU7m5vzBEkG8nMXJjBV000xnNpxfeh

# Default return address stick on the order label
VITE_APP_RETURN_ADDRESS=15 jln kilang barat singapore, 159357
```
