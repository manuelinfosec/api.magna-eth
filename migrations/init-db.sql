/*
 * This SQL file is used to initialize a default database for a Docker PostgreSQL container.
 * 
 * Purpose:
 * --------
 * The primary purpose of this script is to create a new database named 'magna_db'.
 * This database will serve as the foundational database for our application when the Docker container
 * for PostgreSQL is initialized. The creation of this database ensures that all necessary initial 
 * database structures are in place before the application starts.
 * 
 * Usage:
 * ------
 * This script should be executed automatically during the startup of the Docker PostgreSQL container.
 * To achieve this, ensure that the file is placed in the appropriate directory within the Docker context.
 * For instance, typically it should be placed in the '/docker-entrypoint-initdb.d/' directory 
 * if using the official PostgreSQL Docker image. When the container starts, any scripts in this directory 
 * with the '.sql' extension will be executed.
 * 
 * Note:
 * -----
 * - Ensure that the 'POSTGRES_PASSWORD' environment variable is set for the PostgreSQL container 
 *   to avoid authentication issues.
 * - Modify the database name 'magna_db' if a different default database name is required.
 * 
 * This file is essential for setting up the database environment correctly, ensuring that all necessary 
 * resources are available for the application upon container startup.
 * - No action is required of you. All has been handled in the docker-compose definition. 
 */

CREATE DATABASE magna_db