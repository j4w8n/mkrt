# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0).

## [Unreleased]

### Added

- checks that the template file exists, otherwise skips

### Changed

- types for Load => PageLoad and LayoutLoad, respectively

## [0.4.0] - 2022-08-07

### Added

- checks that the template file path exists
- autodetection for typescript
- support for layout files

### Removed

- requirement for a configuration file. defaults are `codekit: 'true'` and `route: 'page'`
- language option in configuration file (now autodetected)
- javascript, typescript, codekit, no-codekit cli options

## [0.3.0] - 2022-08-06

### Added

- support for custom codekit template files
- support for custom route paths, if configured in config.kit.files.routes
- checks to help ensure the config file exists, is an object, and has valid route and language values

## [0.2.0] - 2022-08-05

### Added

- using -s and -n together throws error

### Changed

- uses project config file `mkrt.config.json` instead of global `config.json`
- renames @sveltejs/kit/data to @sveltejs/kit
- check if route files exist in directory, instead of checking if directory has any type of file
- clarifies some code verbiage

### Removes

- mkrt `config` command

## [0.1.2] - 2022-08-02

### Changed

- clarifies install command should be global

### Fixed

- +server.Xs template files to import type RequestHandler, not GET

## [0.1.1] - 2022-08-02

### Changed

- uncommented code which verifies mkrt is running in a project root

### Fixed

- reference to template files, when copying

## [0.1.0] - 2022-08-02

### Added

Well, everything!

[unreleased]: https://github.com/j4w8n/mkrt/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/j4w8n/mkrt/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/j4w8n/mkrt/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/j4w8n/mkrt/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/j4w8n/mkrt/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/j4w8n/mkrt/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/j4w8n/mkrt/releases/tag/v0.1.0