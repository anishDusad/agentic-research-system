import chromadb
from sentence_transformers import SentenceTransformer
import uuid

# Initialize DB
client = chromadb.Client()
collection = client.get_or_create_collection(name="memory")

# Embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


def store_memory(query, analysis):
    embedding = model.encode(query).tolist()

    collection.add(
        documents=[str(analysis)],
        embeddings=[embedding],
        ids=[str(uuid.uuid4())]  # prevents duplicate ID crash
    )


def retrieve_memory(query):
    embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[embedding],
        n_results=2
    )

    return results