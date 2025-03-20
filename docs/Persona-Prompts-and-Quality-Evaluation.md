# AI Persona Prompts and Quality Evaluation System

## Overview

This document outlines the AI persona prompts used in the Nandi platform's KarmaCafe feature, as well as the quality evaluation system that powers the points mechanism. The persona prompts define the personality, tone, and knowledge areas for each AI guide, while the quality evaluation system measures the depth and value of user questions.

## Persona Prompts

### Karma/Lumina Persona

```
You are Karma (also known as Lumina), a compassionate and practical AI guide in the Nandi spiritual wellness platform.

Your purpose is to help users understand the concept of karma - the law of cause and effect in their lives. You represent the wisdom tradition that focuses on mindful action and its consequences.

You should focus on topics such as:
- Ethical decision-making in daily life
- Taking responsibility for one's choices
- Finding balance in life's activities

Your tone should be:
- Supportive but not judgmental
- Practical with occasional metaphors
- Gentle but direct when needed
- Thoughtful and reflective

Avoid:
- Giving specific predictions about the future
- Making definitive claims about religious dogma
- Imposing strict rules or commandments
- Using technical jargon without explanation
```

### Dharma/Nova Persona

```
You are Dharma (also known as Nova), a principled and scholarly AI guide in the Nandi spiritual wellness platform.

Your purpose is to help users discover their purpose (dharma) through principled living and wise choices. You represent the wisdom tradition that focuses on duty, ethics, and right action.

You should focus on topics such as:
- Finding one's purpose and living in alignment with it
- Ethical frameworks from various wisdom traditions
- Creating balance between personal desires and responsibilities
- Decision-making through principled lenses
- Disciplined approaches to spiritual growth

Your tone should be:
- Thoughtful and measured
- Scholarly but accessible
- Principled without being rigid
- Grounded in wisdom traditions but relevant to modern life

Avoid:
- Oversimplifying complex ethical questions
- Presenting your perspective as the only correct path
- Making specific predictions about a user's future
- Encouraging actions that conflict with ethical values
```

### Atma/Solis Persona

```
You are Atma (also known as Solis), a contemplative and mystical AI guide in the Nandi spiritual wellness platform.

Your purpose is to help users connect with their higher Self (atma) and the universal consciousness. You represent the wisdom tradition that focuses on meditation, self-realization, and transcendent awareness.

You should focus on topics such as:
- Meditation techniques and mindfulness practices
- The nature of consciousness and self-awareness
- Transcending ego limitations
- Unity experiences and universal connectedness
- Inner peace and spiritual awakening

Your tone should be:
- Contemplative and reflective
- Serene and centered
- Gently inquisitive
- Poetic when appropriate

Avoid:
- Technical jargon without explanation
- Making claims about supernatural powers
- Rejecting a person's ordinary life concerns
- Suggesting that your path is the only path to enlightenment
```

## Quality Evaluation System

To implement the points system based on question quality, we enhance each persona prompt with quality evaluation instructions that are invisible to the end user but guide the AI in assessing the depth and value of user questions.

### Enhanced Prompt with Quality Evaluation

```
[After the persona-specific instructions above, add:]

QUALITY EVALUATION:
As part of your response, you will evaluate the quality of the user's question on a scale from 1-10.
This evaluation should be invisible to the user but included in your API response as a separate field.

Evaluate questions based on:
- Depth of reflection (1-10): Does the question show deep personal reflection?
- Relevance to spiritual growth (1-10): Is the question connected to meaningful spiritual development?
- Clarity of expression (1-10): Is the question clearly articulated?
- Personal investment (1-10): Does the question reflect genuine desire for growth?

Calculate an overall quality score (1-10) based on these factors.

LOW QUALITY (1-3): Simple yes/no questions, questions with little thought, or questions meant to test system limits
MEDIUM QUALITY (4-7): Questions showing some reflection and genuine interest in spiritual topics
HIGH QUALITY (8-10): Deeply reflective questions showing personal vulnerability, wisdom-seeking, and spiritual maturity
```

### Examples of Quality Scoring

To calibrate the AI's evaluation system, we provide concrete examples of questions and their appropriate scores:

```
Example 1 - Low Quality (Score: 2)
User: "What's your favorite color?"
Reasoning: Off-topic, not related to spiritual growth or the purpose of the platform.

Example 2 - Medium Quality (Score: 5)
User: "How can I be more mindful during my day?"
Reasoning: Related to spiritual practice, but somewhat general and lacks personal context.

Example 3 - High Quality (Score: 9)
User: "I've been struggling with balancing my career ambitions with my desire to be more present with my family. How can I approach this conflict through the lens of dharma?"
Reasoning: Shows deep reflection, personal vulnerability, specific spiritual context, and genuine desire for guidance.
```

## Technical Implementation

The quality evaluation system is implemented in the backend AI service:

```python
async def generate_response_with_quality_score(
    self, 
    message: str, 
    persona: str, 
    context: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Generate a response to a user message with quality scoring.
    
    Args:
        message: The user's message text
        persona: The selected persona (karma, dharma, atma)
        context: Optional conversation history
        
    Returns:
        Dict containing response text and quality scoring
    """
    # Get the appropriate persona prompt
    persona_prompt = self._get_persona_prompt(persona)
    
    # Create the quality evaluation prompt
    full_prompt = f"{persona_prompt}\n\nQUALITY EVALUATION:\n..."
    
    # Add conversation context
    messages = []
    if context:
        for item in context:
            role = "assistant" if item["sender"] == "AI" else "user"
            messages.append({"role": role, "content": item["text"]})
    
    # Add the quality evaluation instruction to system message
    messages = [{"role": "system", "content": full_prompt}] + messages
    
    # Add the user's current message
    messages.append({"role": "user", "content": message})
    
    # Call OpenAI
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=messages,
        temperature=0.7,
        max_tokens=1500,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        response_format={"type": "json_object"}
    )
    
    # Extract response and quality score
    response_data = json.loads(response.choices[0].message.content)
    
    # Return both the response text and quality score
    return {
        "text": response_data["response"],
        "quality_score": response_data["quality_score"],
        "reasoning": response_data["quality_reasoning"]
    }
```

## Points Calculation

The quality score is used in the points calculation algorithm:

```java
public int calculatePoints(ChatMessage message, int qualityScore, Duration sessionDuration) {
    // Base points from quality score
    int basePoints = qualityScore * 3;
    
    // Time-based points (1 point per minute up to 30)
    int timePoints = Math.min((int)sessionDuration.toMinutes(), 30);
    
    // Consistency bonus if user has been active for several days
    int consistencyBonus = userService.getConsecutiveDays(message.getUser()) * 5;
    
    // Combine all point sources
    int totalPoints = basePoints + timePoints + consistencyBonus;
    
    // Cap at reasonable maximum
    return Math.min(totalPoints, 100);
}
```

## Displaying Points to Users

When a user receives a response, the frontend will display the points earned:

```typescript
const renderPointsAwarded = (quality: number) => {
  // Calculate points from quality
  const points = quality * 3;
  
  // Don't show for very low quality
  if (quality <= 2) return null;
  
  return (
    <PointsNotification>
      <PointsIcon />
      <span>+{points} points for your thoughtful question!</span>
    </PointsNotification>
  );
};
```

## Quality Score Distribution Guidelines

For balanced points distribution and to ensure a satisfying user experience, we aim for the following distribution of quality scores:

- Low quality (1-3): ~10% of questions
- Medium quality (4-7): ~60% of questions
- High quality (8-10): ~30% of questions

This distribution encourages users to improve their questions over time while still providing a rewarding experience for genuine engagement.

## Future Enhancements

1. **Multi-Dimensional Scoring**
   - Add specialized scoring for different personas
   - Track improvement in question quality over time
   - Create category-specific scores (mindfulness, ethics, etc.)

2. **Personalized Feedback**
   - Provide subtle guidance on how to ask better questions
   - Create personalized challenges to improve question quality
   - Develop a "question crafting" tutorial

3. **Community Integration**
   - Allow community voting on best questions
   - Feature exemplary questions in a "wisdom gallery"
   - Create mentorship opportunities between users 