

async function request() {
  const randomNumber = Math.floor(Math.random() * 10000) + 1;
  return randomNumber;
}
console.log(request());
module.exports = {
  request: request
};
