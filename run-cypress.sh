if [ -z "$1" ]; then
  echo "Будь ласка, вкажіть ім'я тестового файла (наприклад, favouriteUnits.cy.ts)"
  exit 1
fi

SPEC_FILE=$1

npx cypress run --spec "cypress/e2e/$SPEC_FILE" --browser chrome