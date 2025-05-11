(() => {
    let terminal = null;
    let isSecondRunning = false;

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    const pressKey = async (key, code, keyCode) => {
        if (!terminal) return;
        const event = new KeyboardEvent('keydown', {
            key,
            code,
            keyCode,
            which: keyCode,
            bubbles: true
        });

        console.log(`Dispatching key press for: ${key} (KeyCode: ${keyCode})`);

        terminal.dispatchEvent(event);
        console.log(`Pressed: ${key} (KeyCode: ${keyCode})`);

        // Longer delay after pressing each key to ensure the terminal processes it
        await wait(1000);  // 1-second delay after each key press
    };

    const runFirstCommand = async () => {
        if (isSecondRunning || !terminal) return;

        terminal.focus();
        console.log('Running first command: ls');

        await pressKey('l', 'KeyL', 76); // Press "l"
        await pressKey('s', 'KeyS', 83); // Press "s"
        await pressKey('Enter', 'Enter', 13); // Press Enter
    };

    const runSecondCommand = async () => {
        if (!terminal || isSecondRunning) return;

        isSecondRunning = true;
        terminal.focus();
        console.log('Running second command: bash shortcut');

        // Press "Enter" twice
        await pressKey('Enter', 'Enter', 13);
        await pressKey('Enter', 'Enter', 13);

        // Press "b", "a", "s", "h", then space, then "t", followed by Enter
        const keys = [
            { key: 'b', code: 'KeyB', keyCode: 66 },
            { key: 'a', code: 'KeyA', keyCode: 65 },
            { key: 's', code: 'KeyS', keyCode: 83 },
            { key: 'h', code: 'KeyH', keyCode: 72 },
            { key: ' ', code: 'Space', keyCode: 32 }, // Press Space
            { key: 't', code: 'KeyT', keyCode: 84 },
            { key: 'Enter', code: 'Enter', keyCode: 13 }
        ];

        for (const k of keys) {
            await pressKey(k.key, k.code, k.keyCode); // Press each key with a 1-second delay
        }

        isSecondRunning = false;
    };

    const init = async () => {
        // Wait until terminal is found
        while (!terminal) {
            terminal = document.querySelector('.xterm-helper-textarea');
            if (!terminal) {
                console.log("Waiting for terminal...");
                await wait(1000);
            }
        }

        setInterval(() => {
            if (terminal && !isSecondRunning) {
                runFirstCommand();
            }
        }, 5000);

        setInterval(() => {
            if (terminal) {
                runSecondCommand();
            }
        }, 30000);
    };

    init();
})();
