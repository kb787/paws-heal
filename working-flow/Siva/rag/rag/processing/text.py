# import re
# import string
# from nltk.corpus import stopwords
# from rag.settings import logger

# class TextProcessing:
#     def _clean_text(self, text: str) -> str:
#         try:
#             # Lowercase the text
#             text = text.lower()
            
#             # Remove punctuation
#             text = text.translate(str.maketrans('', '', string.punctuation))
            
#             # Remove extra whitespace
#             text = re.sub(r'\s+', ' ', text).strip()
            
#             # Remove newline chars  
#             text = text.replace('\n', ' ')
#             return text
#         except Exception as e:
#             logger.error(f"Error encountering cleaning the text: {e}")
#             raise 

#     def clean_documents(self, documents: list):
#         try:
#             for docs in documents:
#                 text = docs.text
#                 cleaned_text = self._clean_text(text)
#                 docs.text = cleaned_text
#             logger.info(f"{len(documents)} cleaned successfully.")
#             return documents   
#         except Exception as e:
#             logger.error("Could not clean documents") 
#             raise
    

# text_processing = TextProcessing()
