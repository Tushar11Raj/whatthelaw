import os
import sys

openaiKey = sys.argv[1]
userInput = sys.argv[2]
os.environ['OPENAI_API_KEY'] = openaiKey

from llama_index import GPTSimpleVectorIndex

modified_index = GPTSimpleVectorIndex.load_from_disk('./pages/api/python/vectorIndexModified.json')

response = modified_index.query(userInput, mode="embedding",similarity_top_k=1)

# print("User Input: " + userInput)
print(response)