# Rentzila Cypress

## Introduction
This repository contains automated tests using Cypress, written specifically for the website Rentzila

## Requirements
- **Node.js**: v20.15.1
- **Dependencies**:
    - `@faker-js/faker`: ^9.0.3
    - `dotenv`: ^16.4.5
    - `tsx`: ^4.19.1
    - `typescript`: ^5.6.3
    - `cypress`: ^13.15.1

## Steps to Install
1. **Install Node.js**:

    [Node.js](https://nodejs.org/en/download/package-manager)

2. **Clone the repository**:
    ```sh
    https://github.com/haite4/rentzila-cypress
    ```
3. **Navigate to the project directory**:
    ```sh 
    cd rentzila-cypress
    ```

4. **Install dependencies**:
    ```sh
    npm install
    ``` 

## Steps to Launch

1. **Open cypress app:**:
    ```sh
    npm run cy:open
    ```
2. **Run createUnit tests in headless mode:**:
    ```sh
    npm run cy:createUnit:headles
    ```
3. **Run createUnit tests in headed mode:**:
    ```sh
    npm run cy:createUnit:headed
    ```
4. **Run createUnit tests in firefox browser:**:
    ```sh
    npm run cy:createUnit:firefox
    ```
5. **Run createUnit tests in edge browser:**:
    ```sh
    npm run cy:createUnit:edge
    ```
6. **Run all tests in chrome browser:**:
    ```sh
    npm run cy:all
    ```

## Allure Report: 

1. **Generate Allure Report:**
    ```sh
    npm run allure:generate
    ```
2. **Open Allure Report:**
    ```sh
    npm run allure:open
    ```
## Report on CI: 

[Github Pages allure report](https://haite4.github.io/rentzila-cypress/)

## ENV
- **ADMIN_EMAIL**: you can get from the project owner
- **ADMIN_PASSWORD**: you can get from the project owner
- **ADMIN_PHONE_NUMBER**: you can get from the project owner
- **VALID_PHONE_NUMBER**: you can take any correct Ukrainian number
- **BASE_URL**: you can get from the project owner
- **USER_EMAIL**: You can get after creating an account on rentzila
- **USER_PASSWORD**: You can get after creating an account on rentzila
- **USER_PHONE_NUMBER**: You can get after creating an account on rentzila