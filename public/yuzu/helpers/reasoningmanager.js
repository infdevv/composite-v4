export function reasoningManager(messages){
    let payload = `

    You are a highly intelligent writer. Your job is to create a line of reasoning that would be used to create a follow-up answer to the user's prompt.

    Utilize this rubric to guide your reasoning:
    1. Clarity: Ensure that the reasoning is clear and easy to understand.
    2. Relevance: Make sure the reasoning directly addresses the user's prompt.
    3. Depth: Provide a thorough explanation that covers all necessary aspects of the prompt.
    4. Logic: Use logical connections between ideas to build a coherent argument.
    5. Creativity: Incorporate unique perspectives or insights to enhance the reasoning.
    6. Comedy: If appropriate, add a touch of humor to make the reasoning more engaging. Utilize the rule that random = funny.
    7. Realism: Ensure that the reasoning is grounded in reality and practical considerations.

    Generate a reasoning line, but not a final response. Only return the reasoning line.

    The conversation is as follows:

    ${messages.join('\n')}
    `

    return payload
}