# Blyedev's Calendar App

![Repobeats analytics image](https://repobeats.axiom.co/api/embed/63ce103c11b70e3240f31868b2a7fc4f68b5ae41.svg "Repobeats analytics image")

> ⚠️ This repository is NOT a finished product but my staging ground for new and exciting tech. It has rarely ever worked as a complete app. Nonetheless it is my pride and joy.

#### Table of Contents

* [Why calendars](#why-calendars)
* [Features](#features)
     - [Dockerized local development environment](#dockerized-local-development-environment)
     - [CI Pipeline](#ci-pipeline)
     - [Event rendering](#event-rendering)
* [Acknowledgements](#acknowledgements)

## Why calendars

At first the idea was born to create a calendar for me and me only that would codify my approach to time tracking. That specific approach utilizes the principles of cost accounting. Each cost center focuses on a specific task such as cooking. I track the cumulative time it requires and to which other cost centers do I attribute the cost.

Existing calendars such as google calendar, allow for tracking time in this way. What they don't do is provide a dashboard with metrics I care about divided by cost centers. For that reason long ago I decided to work on my own one. First implementing the calendar itself then the custom tailored aspect.

Keeping my current pace while following the roadmap I plan to finish this app in the late 2030s. Meaning I don't plan to finish it at all. It has become a testing ground for new build tools, status checks or CI/CD pipelines. I sometimes write features following my initial plan, but nowadays I only ever do it to test my workflow.

### So why even release it?

Because I strongly believe in open source. I think even if one person get's inspired by the solutions I found to the problems of this codebase that would make the release a net positive.

## Features

### Dockerized local development environment

If you ever want to work on this repository all you would need to do is clone it and assuming you have docker compose installed run:

```bash
docker compose up --watch --build
```

This builds each part of the monorepo along with a reverse proxy that allows you to access your website and the API on port 80.

This idea is not novel in any way, what is novel is the fact that it uses the brand new docker compose watch feature. This allows us to sync our filesystem to the containers, taking advantage of the angular and django developement servers without using volumes. It even handles real time dependency updates by having a rebuild be triggered each time the lockfile changes. All of this without ever polluting your file system with those pesky node modules.

### CI Pipeline

**Github flow**: This repository assumes the main branch should always be stable and deployable, while changes are made on feature branches. This order is sometimes conciously broken because it has never been stable and so feature branches are used mostly for modularity of changes and incremental stabilization of the codebase.

**Status Checks**: Type checking, linting and formatting is quite agressive in this project. The frontend uses `typescript`, `eslint`, `stylelint` and `prettier` while the backend uses `mypy` and `ruff` (both linter and formatter). Precommit hooks are planned but not yet configured.

#### Features in progress

**Testing**: The backend requires little of them as it's essentially a CRUD app. Most of it's complexity is in the models and serializers. The frontend has jest set up to test in the terminal without the chrome binary but only parts of the app are tested and most of them fail.

**Deployments**: A deployment pipeline used to exist and you are welcome to check the projects history and see it's iterations. Because of the infinitely negative ROI of this project the assets required to run a deployment have been deprovisioned. The Dockerfiles have been significantly modified since the last deplyment, because of which I cannot vouch for their state or if they run.

**Infrastucture as Code**: Is the next feature on the roadmap.

### Event rendering

The first feature I ever recreated here is the behaviour of how event's overlap in google calendar. As trivial as that feature sounds it was a pretty complex topic to dig in to. For a demo you will have to wait for the event creation feature ;)

## Acknowledgements

Thank you to the amazing django community for the support and knowledge they've shared and transitively contributed to this project. While this project is still very early in it's lifecycle it wouldn't have went the short way it did without them.
