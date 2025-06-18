function lowFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const transform = stringInput => {
  const key = lowFirstLetter(
    stringInput
      .trim()
      .split(' ')
      .map(i => capitalizeFirstLetter(i))
      .join(''),
  );
  const value = stringInput;

  console.log(`"${key}": "${value}"`);

  console.log(`t("common.${key}")`);
};

const input = 'Click to Upload';
transform(input);
