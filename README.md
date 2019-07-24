# GCF Task Force Knowledge Database (Website Component)

This is the website component of the *GCF Task Force Knowledge Database*. For a technical overview of the project, please refer to the [API](https://github.com/gcftaskforce/kdb-api) README under *Project Overview*.

The website fetches data from the API and builds content from the EJS templates in [/views](/views).

Note that the EJS Express middleware is not used. Instead a *context" is build in [app.js](app.js) based on the *request* parameters then passed to the [site.js](site.js) *renderPage* function. The API is called within [site.js](site.js) and the returned data and *context* passed to the appropriate *view*.

## Environment

The following environment variables are used. Possible values for a localhost setup are in parenthesis.

- **PORT**  HTTP port the website is run on (3002)
- **BASE_URI** Used as the base for building internal hrefs (```http://localhost:8080/```)
- **SOURCE_DATA_HOSTNAME** This references the API (```http://localhost:3001``` if a local version of the API is running, otherwise use the live API)
- **SOURCE_DATA_PATHNAME** This is the API base route name (json)
- **CLIENT_API_ENDPOINT** This is passed to the browser bundle via webpack plugin. It is the URI used by the CMS to interact with the API
- **SITE_VERSION** *optional*
- **CMS_VERSION** *optional*
- **CMS_AUTHENTICATION_ROUTE** The site route name for authenticating users
- **SESSION_NAME** name of session used for authenticated users
- **SESSION_SECRET** key (salt) for the session
- **USERS_PATH** absolute path to approved-users JSON file, which is just an array of string access keys.

## Startup

All required environment variables are checked at startup.

This is an API-based application; the API connection must be established at startup. A *fetch* request is made to the API to set the application-level "constants" REGION_DEFS and LANGS. The application fails early if this *fetch* fails.

## Browser-Side Code and Webpack Configuration

The *Deforestation Rates* chart relies on browser-side code. Please see the repository [https://github.com/gcftaskforce/kdb-rate-chart](https://github.com/gcftaskforce/kdb-rate-chart) for details.

Additionally, the inline CMS is rendered browser site. Please see the repository [https://github.com/gcftaskforce/kdb-site-cms](https://github.com/gcftaskforce/kdb-site-cms).

For development and building, these repositories could be cloned into [/src](/src). Notice the **two** Webpack configs [webpack.dev.config.js](webpack.dev.config.js) and [webpack.prod.config.js](webpack.prod.config.js) (for building). [webpack.dev.config.js](webpack.dev.config.js) defines `CLIENT_API_ENDPOINT` and is thus self contained. [webpack.prod.config.js](webpack.prod.config.js) however uses the `CLIENT_API_ENDPOINT` environment variable.

## Translated Content and Labels

Per client specification, all content must be available in all supported languages. As discussed above, supported languages are available to the application through a *fetch* to the API during application startup.

It is the responsibility of the API to return both (1) text data in the requested language (or English as default) and (2) all data labels in the requested language.

However, string values related to the Website structure are specified in [/etc/translation-defs.js](/etc/translation-defs.js). These strings include nav items, section headings, and footnotes.

## Citations

Each datum partial in [views/partials/](views/partials/) must include some boilerplate to push its record's citation (if included) onto the *context*'s *citation* array.

This populated *citation* array is available to the page views [/views/pages](/views/pages)for display.

## The ```public``` Directory

### Downloads

Note that the path ```/public/assets/``` is not part of the repository.

The sole subdirectory within this excluded path is ```downloads/```, which contains document downloads referenced in text fields, especially those related to the *Frameworks* section. These files are large and not necessary for website development or operation.

During a data-entry effort, the client acquired a significant number of documents and requested that they be bulk uploaded and made available for linking. A batch script was used to copy these files into an organized "managed" directory, renaming them in deburred snake case during the process. Anticipating the usefulness of the of the original filenames (which correspond to the document titles), an array catalog of the files was maintained. It can be found at [/public/managed-documents.json](/public/managed-documents.json).

The client declined a recommendation to integrate a file upload system into the CMS. Also, the client appears to have simply switched to hosting relevant files on a Google Drive.
