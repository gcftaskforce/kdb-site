# GCF Task Force Knowledge Database (Website Component)

This is the website component of the *GCF Task Force Knowledge Database*. For a technical overview of the project, please refer to the [API](https://github.com/gcftaskforce/kdb-api) README under *Project Overview*.

## Environment

The following environment variables are required:

- **PORT**  HTTP port the website is run on
- **BASE_URI** http://localhost:8080/
- **SOURCE_DATA_HOSTNAME** 'http://localhost:3001'
- **SOURCE_DATA_PATHNAME** json
- **SITE_VERSION**
- **CMS_VERSION**
- **CMS_AUTHENTICATION_ROUTE**
- **SESSION_NAME** name of session used for authenticated users
- **SESSION_SECRET** key (salt) for the session
- **USERS_PATH** absolute path to approved-users JSON file

