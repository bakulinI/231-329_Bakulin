from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()

API_KEY = os.getenv('API_KEY')

openai = OpenAI(
    api_key=API_KEY,
    base_url="https://api.deepinfra.com/v1/openai",
)

    
def stream_chat_completion(messages):
    """
    Генератор, который по частям возвращает потоковые ответы от OpenAI.
    """
    chat_completion = openai.chat.completions.create(
        model="meta-llama/Meta-Llama-3-8B-Instruct",
        messages=messages,
        stream=True,
    )

    for event in chat_completion:
        delta = event.choices[0].delta
        # Проверяем, есть ли атрибут "content" в delta
        if hasattr(delta, "content") and delta.content:
            yield delta.content
       
