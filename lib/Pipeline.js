const assert = require('assert');

class Pipeline {
    send(passable) {
        this.passable = passable;
        return this;
    }

    through(pipes) {
        assert(Array.isArray(pipes));
        this.pipes = pipes;
        return this;
    }

    then(destination) {
        assert(typeof destination === 'function');
        const final = passable => destination(passable);
        const pipeline = this.pipes
            .reverse()
            .reduce((next, pipe) => passable => pipe(passable, next), final);
        return pipeline(this.passable);
    }
}

module.exports = Pipeline;
