const { format } = require("date-fns");
const valid = require("date-fns/isValid");

function isValid() {
  const date = format(new Date(2021, 1, 22), "yyyy-MM-dd");
  return valid(date);
}
if (isValid == false) {
  console.log(true);
} else {
  console.log(false);
}
