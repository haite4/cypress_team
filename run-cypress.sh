SPEC_FILE="**"
BROWSER="chrome"

while getopts ":s:b:" opt; do
  case $opt in
    s)
      if [[ -z "$OPTARG" ]]; then
        echo "Error: Option -s requires an argument."
        exit 1
      fi
      SPEC_FILE="$OPTARG"
      ;;
    b)
      if [[ -z "$OPTARG" ]]; then
        echo "Error: Option -b requires an argument."
        exit 1
      fi
      BROWSER="$OPTARG"
      ;;
    \?)
      echo "Unknown option: -$OPTARG"
      exit 1
      ;;
    :)
      echo "Error: Option -$OPTARG requires an argument."
      exit 1
      ;;
  esac
done

echo "Running Cypress with the following settings:"
echo "  SPEC_FILE: cypress/e2e/$SPEC_FILE"
echo "  BROWSER: $BROWSER"

npx cypress run --spec "cypress/e2e/$SPEC_FILE" --browser "$BROWSER"
