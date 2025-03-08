from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import pickle
from typing import List, Tuple
import os

class EmbeddingStore:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
        self.dimension = 384  # Dimension for all-MiniLM-L6-v2
        self.index = faiss.IndexFlatL2(self.dimension)
        self.texts: List[str] = []
        self.sources: List[str] = []

    def add_texts(self, texts: List[str], sources: List[str]) -> None:
        if len(texts) != len(sources):
            raise ValueError("Number of texts and sources must match")
        
        embeddings = self.model.encode(texts)
        self.index.add(np.array(embeddings).astype('float32'))
        self.texts.extend(texts)
        self.sources.extend(sources)

    def similarity_search(self, query: str, k: int = 3) -> List[Tuple[str, str, float]]:
        query_embedding = self.model.encode([query])
        distances, indices = self.index.search(np.array(query_embedding).astype('float32'), k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.texts):  # Ensure index is valid
                results.append((
                    self.texts[idx],
                    self.sources[idx],
                    float(distances[0][i])
                ))
        return results

    def save(self, directory: str) -> None:
        os.makedirs(directory, exist_ok=True)
        faiss.write_index(self.index, os.path.join(directory, "faiss_index"))
        with open(os.path.join(directory, "metadata.pkl"), "wb") as f:
            pickle.dump((self.texts, self.sources), f)

    def load(self, directory: str) -> None:
        self.index = faiss.read_index(os.path.join(directory, "faiss_index"))
        with open(os.path.join(directory, "metadata.pkl"), "rb") as f:
            self.texts, self.sources = pickle.load(f)