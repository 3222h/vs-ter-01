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
        console.log('Running second command: bash t');

        try {
            await navigator.clipboard.writeText('bash t');
            console.log('Copied "bash t" to clipboard');
            
            const pasteEvent = new KeyboardEvent('keydown', {
                key: 'v',
                code: 'KeyV',
                ctrlKey: true,
                shiftKey: true,
                bubbles: true,
                cancelable: true
            });
            terminal.dispatchEvent(pasteEvent);
            await pressKey('Enter', 'Enter', 13); // Press Enter after paste
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
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
