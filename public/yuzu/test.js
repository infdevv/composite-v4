import yuzu from './client.js';

const yuzuClient = new yuzu()

// generate

async function test() {

    // Test non-streaming generation
    // const response = await yuzuClient.generate([{"role": "user", "content": "What is the meaning of life?"}]);
    // console.log(response);

    // Test streaming generation
    await yuzuClient.generateStreaming([{"role": "user", "content": "What is the meaning of life?"}], (chunk) => {
        if (chunk && chunk.choices && chunk.choices[0] && chunk.choices[0].delta && chunk.choices[0].delta.content) {
            process.stdout.write(chunk.choices[0].delta.content);
        }
    });

    console.log('\n'); // Add newline after streaming completes
}

test()

// streaming

