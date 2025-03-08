from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import pickle
from typing import List, Tuple, Dict, Optional
import os

class EmbeddingStore:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2', namespace: str = 'default'):
        self.model = SentenceTransformer(model_name)
        self.dimension = 384  # Dimension for all-MiniLM-L6-v2
        self.index = faiss.IndexFlatL2(self.dimension)
        self.texts: List[str] = []
        self.sources: List[str] = []
        self.metadata: List[Dict] = []
        self.namespace = namespace
        
        # Try to load existing index for this namespace
        try:
            self.load(f"data/{namespace}")
        except:
            pass

    def add_texts(self, texts: List[str], sources: List[str], metadata: Optional[List[Dict]] = None) -> None:
        if len(texts) != len(sources):
            raise ValueError("Number of texts and sources must match")
            
        if metadata and len(metadata) != len(texts):
            raise ValueError("If provided, metadata length must match texts length")
        
        embeddings = self.model.encode(texts)
        self.index.add(np.array(embeddings).astype('float32'))
        self.texts.extend(texts)
        self.sources.extend(sources)
        self.metadata.extend(metadata if metadata else [{}] * len(texts))
        
        # Auto-save after adding new texts
        try:
            self.save(f"data/{self.namespace}")
        except:
            pass

    def similarity_search(
        self, 
        query: str, 
        k: int = 3,
        metadata_filters: Optional[Dict] = None
    ) -> List[Tuple[str, str, float]]:
        query_embedding = self.model.encode([query])
        distances, indices = self.index.search(np.array(query_embedding).astype('float32'), k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.texts):  # Ensure index is valid
                # Apply metadata filters if provided
                if metadata_filters:
                    metadata = self.metadata[idx]
                    if not all(metadata.get(key) == value for key, value in metadata_filters.items()):
                        continue
                
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
            pickle.dump((self.texts, self.sources, self.metadata), f)

    def load(self, directory: str) -> None:
        self.index = faiss.read_index(os.path.join(directory, "faiss_index"))
        with open(os.path.join(directory, "metadata.pkl"), "rb") as f:
            self.texts, self.sources, self.metadata = pickle.load(f)

    def get_metadata(self, index: int) -> Dict:
        """Get metadata for a specific document."""
        if 0 <= index < len(self.metadata):
            return self.metadata[index]
        return {}