(() => {
    let terminal = null;
    let isSecondRunning = false;

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Updated pressKey function with delay included
    const pressKey = async (key, code, keyCode) => {
        if (!terminal) return;
        const event = new KeyboardEvent('keydown', {
            key,
            code,
            keyCode,
            which: keyCode,
            bubbles: true
        });
        terminal.dispatchEvent(event);
        console.log(`Pressed: ${key}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay after each key press
    };

    const runFirstCommand = async () => {
        if (isSecondRunning || !terminal) return;

        terminal.focus();
        await pressKey('l', 'KeyL', 76); // Press "l"
        await pressKey('s', 'KeyS', 83); // Press "s"
        await pressKey('Enter', 'Enter', 13); // Press Enter
    };

    const runSecondCommand = async () => {
        if (!terminal || isSecondRunning) return;

        isSecondRunning = true;
        terminal.focus();

        const keys = [
            { key: 'Enter', code: 'Enter', keyCode: 13 },
            { key: 'Enter', code: 'Enter', keyCode: 13 },
            { key: 'b', code: 'KeyB', keyCode: 66 },
            { key: 'a', code: 'KeyA', keyCode: 65 },
            { key: 's', code: 'KeyS', keyCode: 83 },
            { key: 'h', code: 'KeyH', keyCode: 72 },
            { key: 't', code: 'KeyT', keyCode: 84 },
            { key: 'Enter', code: 'Enter', keyCode: 13 },
        ];

        for (const k of keys) {
            await pressKey(k.key, k.code, k.keyCode); // Press each key with a 500ms delay
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
        }, 10000);
    };

    init();
})();
