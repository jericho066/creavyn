export class HistoryManager {
    constructor(initialState, maxHistory = 50) {
        this.history = [initialState];
        this.currentIndex = 0;
        this.maxHistory = maxHistory;
    }

    push(newState) {
        //* to remove any future states.
        this.history = this.history.slice(0, this.currentIndex +1);

        //* to addd new state
        this.history.push(JSON.parse(JSON.stringify(newState)));

        //* to limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }
    }

    undo() {
        if (this.canUndo()) {
        this.currentIndex--;
        return this.history[this.currentIndex];
        }
        return null;
    }

    redo() {
        if (this.canRedo()) {
        this.currentIndex++;
        return this.history[this.currentIndex];
        }
        return null;
    }

    canUndo() {
        return this.currentIndex > 0;
    }

    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    getCurrentState() {
        return this.history[this.currentIndex];
    }

    clear() {
        this.history = [this.history[this.currentIndex]];
        this.currentIndex = 0;
    }

}

