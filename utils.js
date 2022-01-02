exports.waitMs = (ms) => new Promise(resolve=>setTimeout(resolve, ms));
exports.getRandomInt = (...numbers) => {
    let min, max;
    if (Array.isArray(numbers[0])) numbers = numbers[0];
    max = numbers[1]
    min = numbers[0];

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}