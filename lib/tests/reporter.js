const colors = {
    comment: 33,
    pass: 32,
    fail: 31,
    'test title': 90,
    'suite title': 90,
    'error stack': 90,
};

const symbols = {
    ok: '\u221A',
    fail: '\u00D7',
    suite: '#',
};


function color(type, str) {
    return '\u001b[' + colors[type] + 'm' + str + '\u001b[0m';
}

function failure(error, description, timing) {
    console.log(color('fail', symbols.fail) + ' %s%s', description, timing);
    const errorMessage = `${error.name}: ${error.message}`; 
    let { stack } = error;
    const index = stack.indexOf(errorMessage);
    if (index !== -1) {
        stack = stack.slice(index + errorMessage.length + 1);
    }
    console.log(color('fail', errorMessage) + (stack.length > 0 ? color('error stack', `\n${stack}`) : ''));
}

function success(description, timing) {
    console.log(color('pass', symbols.ok) + color('test title', ' %s%s'), description, timing);
}

module.exports = {
    color,
    colors,
    symbols,
    success,
    failure,
};
